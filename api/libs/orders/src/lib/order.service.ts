import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Order,
  OrderDocument,
  Poster,
  User,
  PosterDocument,
  UserDocument,
  CreateOrderDto,
  OrderStatus,
} from '@poster-parlor-api/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedOrdersResponse } from '@poster-parlor-api/shared';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Poster.name) private posterModel: Model<PosterDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Validate order items and return pricing info
   * Used for payment initiation to verify amounts
   */
  public async validateOrderItems(
    items: { posterId: string; quantity: number; price: number }[]
  ): Promise<{
    validatedItems: { posterId: string; quantity: number; price: number }[];
    subtotal: number;
  }> {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Validate IDs
    if (items.some((item) => !this.isValidObjectId(item.posterId))) {
      throw new BadRequestException('Invalid poster ID format');
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const poster = await this.posterModel.findById(item.posterId).lean();
      if (!poster) {
        throw new NotFoundException(
          `Poster with ID ${item.posterId} not found`
        );
      }

      // Check stock availability
      if (poster.stock !== undefined && poster.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for poster "${poster.title}". Available: ${poster.stock}, Requested: ${item.quantity}`
        );
      }

      // Verify price matches (avoid price manipulation)
      if (Math.abs(item.price - poster.price) > 0.01) {
        throw new BadRequestException(
          `Price mismatch for poster "${poster.title}". Expected: ${poster.price}, Received: ${item.price}`
        );
      }

      validatedItems.push({
        posterId: item.posterId,
        quantity: item.quantity,
        price: poster.price,
      });

      subtotal += poster.price * item.quantity;
    }

    return { validatedItems, subtotal };
  }

  public async createOrder(
    orderDetail: CreateOrderDto,
    paymentInfo?: { razorpayPaymentId?: string; razorpayOrderId?: string }
  ): Promise<OrderDocument> {
    try {
      // ------------------ ID VALIDATION ------------------
      if (
        (orderDetail.userId && !this.isValidObjectId(orderDetail.userId)) ||
        orderDetail.items?.some((item) => !this.isValidObjectId(item.posterId))
      ) {
        throw new BadRequestException('Invalid ID format');
      }

      // ------------------ ITEM VALIDATION ------------------
      let subtotal = 0;
      const validatedItems = [];
      for (const item of orderDetail.items) {
        const poster = await this.posterModel.findById(item.posterId).lean();
        if (!poster) {
          throw new NotFoundException(
            `Poster with ID ${item.posterId} not found`
          );
        }

        // Check stock availability
        if (poster.stock !== undefined && poster.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for poster "${poster.title}". Available: ${poster.stock}, Requested: ${item.quantity}`
          );
        }

        // Verify price matches (avoid price manipulation)
        if (Math.abs(item.price - poster.price) > 0.01) {
          throw new BadRequestException(
            `Price mismatch for poster "${poster.title}". Expected: ${poster.price}, Received: ${item.price}`
          );
        }

        validatedItems.push({
          posterId: item.posterId,
          quantity: item.quantity,
          price: poster.price,
        });

        subtotal += poster.price * item.quantity;
      }

      // ------------------ CUSTOMER INFO ------------------
      let customerInfo = null;

      if (orderDetail.userId) {
        const user = await this.userModel.findById(orderDetail.userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }

        customerInfo = {
          userId: orderDetail.userId,
          name: orderDetail.customer?.name || user.name,
          email: orderDetail.customer?.email || user.email,
          phone: orderDetail.customer?.phone,
        };
      }

      // ------------------ CALCULATIONS ------------------
      const shippingCost =
        orderDetail.shippingCost ??
        this.calculateShipping(subtotal, orderDetail.shippingAddress.state);

      const taxAmount = orderDetail.taxAmount ?? this.calculateTax(subtotal);

      const totalPrice =
        orderDetail.totalPrice ?? subtotal + shippingCost + taxAmount;

      // Payment amount must match
      if (Math.abs(orderDetail.paymentDetails.amount - totalPrice) > 0.01) {
        throw new BadRequestException(
          `Payment amount mismatch. Expected: ${totalPrice}, Received: ${orderDetail.paymentDetails.amount}`
        );
      }
      // ------------------ PAYMENT METHOD VALIDATION ------------------
      // Build payment details with transaction ID from Razorpay if available
      const paymentDetails = {
        ...orderDetail.paymentDetails,
        transactionId:
          paymentInfo?.razorpayPaymentId ||
          orderDetail.paymentDetails.transactionId ||
          '',
      };

      // ------------------ CREATE ORDER ------------------
      const order = new this.orderModel({
        customer: customerInfo,
        items: validatedItems,
        shippingAddress: orderDetail.shippingAddress,
        paymentDetails,
        status: orderDetail.status || OrderStatus.PENDING,
        isPaid:
          orderDetail.isPaid ?? orderDetail.paymentDetails.method !== 'COD',
        shippingCost,
        taxAmount,
        totalPrice,
        notes: orderDetail.notes,
      });

      const savedOrder = await order.save();
      if (!savedOrder) {
        throw new BadRequestException('Failed to create order');
      }

      // ------------------ UPDATE STOCK ------------------
      for (const item of validatedItems) {
        await this.posterModel.findByIdAndUpdate(item.posterId, {
          $inc: { stock: -item.quantity },
        });
      }

      return savedOrder;
    } catch (error) {
      // Log the error for debugging replace with proper logging in real app
      console.error('Order Creation Failed:', error);

      // global error handler will handle it
      throw error;
    }
  }

  public async getOrdersByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedOrdersResponse> {
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Ensure valid pagination values
    const validPage = Math.max(1, page);
    const validLimit = Math.min(50, Math.max(1, limit)); // Max 50 items per page
    const skip = (validPage - 1) * validLimit;

    // Get total count for pagination
    const totalOrders = await this.orderModel
      .countDocuments({ 'customer.userId': userId })
      .exec();

    // Get paginated orders sorted by newest first
    const orders = await this.orderModel
      .find({ 'customer.userId': userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .exec();

    const totalPages = Math.ceil(totalOrders / validLimit);

    return {
      orders,
      pagination: {
        currentPage: validPage,
        totalPages,
        totalOrders,
        limit: validLimit,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
      },
    };
  }

  public async getOrderById(
    orderId: string,
    userId?: string
  ): Promise<OrderDocument> {
    if (!this.isValidObjectId(orderId)) {
      throw new BadRequestException('Invalid order ID format');
    }

    const order = await this.orderModel
      .findById(orderId)
      .populate({
        path: 'items.posterId',
        model: 'Poster',
        select: 'title images dimensions material category',
      })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // If userId is provided, verify the order belongs to the user
    if (userId && order.customer?.userId?.toString() !== userId) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  // Helper methods for calculations
  // NOTE: These calculations must match the frontend pricing utils at:
  // web/src/lib/utils/pricing.utils.ts
  private calculateShipping(subtotal: number, state: string): number {
    const baseShipping = 50;
    const freeShippingThreshold = 250;

    // Free shipping if subtotal >= ₹250, otherwise ₹50 flat fee
    const shipping = subtotal >= freeShippingThreshold ? 0 : baseShipping;

    // Add state-based shipping (higher for remote areas)
    const remoteStates = ['Jammu and Kashmir', 'Arunachal Pradesh', 'Ladakh'];
    const remoteCharge = remoteStates.includes(state) ? 150 : 0;

    // Formula: (0 or 50) + remote charge (150 for remote states)
    return shipping + remoteCharge;
  }

  private calculateTax(subtotal: number): number {
    // 18% GST for India
    return Math.round(subtotal * 0.18);
  }
}
