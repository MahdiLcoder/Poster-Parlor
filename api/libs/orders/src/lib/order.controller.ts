import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  CreateOrderDto,
  InitiatePaymentDto,
  VerifyPaymentDto,
  OrderStatus,
} from '@poster-parlor-api/models';
import { Auth, CurrentUser } from '@poster-parlor-api/auth';
import type { AuthenticatedUser } from '@poster-parlor-api/shared';
import { OrdersService } from './order.service';
import { PaymentService } from './payment.service';
import {
  HttpResponseUtil,
  BadRequestException,
} from '@poster-parlor-api/utils';

@Controller('order')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentService: PaymentService
  ) {}

  /**
   * Get Razorpay Key ID for frontend initialization
   */
  @Get('payment/key')
  @Auth()
  getPaymentKey() {
    const keyId = this.paymentService.getKeyId();
    return HttpResponseUtil.success({ keyId }, 'Payment key fetched');
  }

  /**
   * Initiate payment - creates a Razorpay order
   */
  @Post('payment/initiate')
  @Auth()
  async initiatePayment(
    @Body() dto: InitiatePaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    // Validate and calculate pricing
    const validatedPricing = await this.ordersService.validateOrderItems(
      dto.items
    );

    // Create Razorpay order with total amount in paise
    const amountInPaise = Math.round(dto.totalPrice * 100);
    // Receipt must be <= 40 chars: use shortened user ID + timestamp
    const shortUserId = user.id.slice(-8);
    const timestamp = Date.now().toString(36); // Base36 for shorter string
    const receipt = `ord_${shortUserId}_${timestamp}`;

    const razorpayOrder = await this.paymentService.createOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        userId: user.id,
        itemCount: String(dto.items.length),
        subtotal: String(validatedPricing.subtotal),
      },
    });

    return HttpResponseUtil.success(
      {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: this.paymentService.getKeyId(),
      },
      'Payment order created'
    );
  }

  /**
   * Verify payment and create order after successful Razorpay payment
   */
  @Post('payment/verify')
  @Auth()
  async verifyPaymentAndCreateOrder(
    @Body() dto: VerifyPaymentDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    // Verify the payment signature
    const verification = this.paymentService.verifyPaymentSignature({
      razorpay_order_id: dto.razorpay_order_id,
      razorpay_payment_id: dto.razorpay_payment_id,
      razorpay_signature: dto.razorpay_signature,
    });

    if (!verification.isValid) {
      throw new BadRequestException(
        'Payment verification failed. Please contact support.'
      );
    }

    // Create the order with verified payment
    const orderData: CreateOrderDto = {
      userId: user.id,
      customer: dto.customer,
      items: dto.items,
      shippingAddress: dto.shippingAddress,
      paymentDetails: {
        method: 'ONLINE',
        amount: dto.totalPrice,
        currency: 'INR',
      },
      status: OrderStatus.PROCESSING, // Auto-move to processing for paid orders
      isPaid: true,
      shippingCost: dto.shippingCost,
      taxAmount: dto.taxAmount,
      totalPrice: dto.totalPrice,
      notes: dto.notes,
      razorpayOrderId: dto.razorpay_order_id,
    };

    const order = await this.ordersService.createOrder(orderData, {
      razorpayPaymentId: dto.razorpay_payment_id,
      razorpayOrderId: dto.razorpay_order_id,
    });

    return HttpResponseUtil.success(
      order,
      'Payment verified and order created'
    );
  }

  /**
   * Create order (for COD or direct order creation)
   */
  @Post()
  @Auth()
  async createOrder(
    @Body() orderDetail: CreateOrderDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    if (user) {
      orderDetail.userId = user.id;
    }
    const order = await this.ordersService.createOrder(orderDetail);
    return HttpResponseUtil.success(order, 'Order created successfully');
  }

  @Get()
  @Auth()
  async getUserOrders(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const result = await this.ordersService.getOrdersByUserId(
      user.id,
      pageNum,
      limitNum
    );
    return HttpResponseUtil.success(result, 'Orders fetched successfully');
  }

  @Get(':id')
  @Auth()
  async getOrderById(
    @Param('id') orderId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const order = await this.ordersService.getOrderById(orderId, user.id);
    return HttpResponseUtil.success(order, 'Order fetched successfully');
  }
}
