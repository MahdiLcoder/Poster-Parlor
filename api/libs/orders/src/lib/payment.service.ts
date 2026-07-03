import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfigService } from '@poster-parlor-api/config';
import {
  CreatePaymentOrderDto,
  PaymentVerificationResult,
  RazorpayOrder,
  VerifyPaymentDto,
} from '@poster-parlor-api/shared';
import Razorpay from 'razorpay';
import crypto from 'crypto';
@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(private readonly configService: AppConfigService) {
    const { razorpayKeyId, razorpayKeySecret } =
      this.configService.paymentConfig;

    this.razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  }

  /**
   * Get Razorpay Key ID for frontend
   */
  getKeyId(): string {
    return this.configService.paymentConfig.razorpayKeyId;
  }

  /**
   * Create a Razorpay order for payment
   * @param dto - Payment order details
   * @returns Razorpay order object
   */
  async createOrder(dto: CreatePaymentOrderDto): Promise<RazorpayOrder> {
    try {
      const options = {
        amount: Math.round(dto.amount), // Amount should already be in paise
        currency: dto.currency || 'INR',
        receipt: dto.receipt,
        notes: dto.notes || {},
      };

      const order = (await this.razorpay.orders.create(
        options
      )) as RazorpayOrder;

      return order;
    } catch (error) {
      throw new BadRequestException(
        'Failed to create payment order. Please try again.'
      );
    }
  }

  /**
   * Verify payment signature from Razorpay callback
   * @param dto - Payment verification data
   * @returns Verification result
   */
  verifyPaymentSignature(dto: VerifyPaymentDto): PaymentVerificationResult {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = dto;

    const { razorpayKeySecret } = this.configService.paymentConfig;

    // Create the expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return {
      isValid,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    };
  }

  /**
   * Fetch payment details from Razorpay
   * @param paymentId - Razorpay payment ID
   */
  async getPaymentDetails(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      throw new BadRequestException('Failed to fetch payment details');
    }
  }
}
