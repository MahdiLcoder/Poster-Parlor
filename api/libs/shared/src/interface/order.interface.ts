import { OrderDocument } from '@poster-parlor-api/models';

export interface CreatePaymentOrderDto {
  amount: number; // Amount in paise (INR * 100)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface VerifyPaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerificationResult {
  isValid: boolean;
  orderId: string;
  paymentId: string;
}

export interface PaginatedOrdersResponse {
  orders: OrderDocument[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
