import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { buildApiUrl } from "@/lib/helpers";

// Poster image interface
export interface PosterImage {
  url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
}

// Populated poster details (when order is fetched with populate)
export interface PopulatedPoster {
  _id: string;
  title: string;
  images: PosterImage[];
  dimensions: string;
  material?: string;
  category: string;
}

// Types matching the backend DTOs
export interface OrderItemDto {
  posterId: string | PopulatedPoster; // Can be string or populated poster
  quantity: number;
  price: number;
}

export interface ShippingAddressDto {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PaymentDetailsDto {
  method: "ONLINE" | "COD";
  amount: number;
  currency: "INR";
}

export interface CustomerInfoDto {
  name: string;
  email?: string;
  phone: string;
  userId?: string;
}

export interface CreateOrderDto {
  customer?: CustomerInfoDto;
  userId?: string;
  items: { posterId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddressDto;
  paymentDetails: PaymentDetailsDto;
  status?: string;
  isPaid?: boolean;
  shippingCost?: number;
  taxAmount?: number;
  totalPrice?: number;
  notes?: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderResponse {
  _id: string;
  customer: CustomerInfoDto | null;
  items: OrderItemDto[];
  shippingAddress: ShippingAddressDto;
  paymentDetails: PaymentDetailsDto;
  status: OrderStatus;
  isPaid: boolean;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedOrdersResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
}

// Payment Types
export interface InitiatePaymentDto {
  items: { posterId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddressDto;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
}

export interface InitiatePaymentResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  customer?: CustomerInfoDto;
  items: { posterId: string; quantity: number; price: number }[];
  shippingAddress: ShippingAddressDto;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
}

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Payment endpoints
    getPaymentKey: builder.query<{ data: { keyId: string } }, void>({
      query: () => "/order/payment/key",
    }),

    initiatePayment: builder.mutation<
      { data: InitiatePaymentResponse },
      InitiatePaymentDto
    >({
      query: (paymentData) => ({
        url: "/order/payment/initiate",
        method: "POST",
        body: paymentData,
      }),
    }),

    verifyPayment: builder.mutation<{ data: OrderResponse }, VerifyPaymentDto>({
      query: (verifyData) => ({
        url: "/order/payment/verify",
        method: "POST",
        body: verifyData,
      }),
      invalidatesTags: ["Order"],
    }),

    // Order endpoints
    createOrder: builder.mutation<{ data: OrderResponse }, CreateOrderDto>({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    getMyOrders: builder.query<
      { data: PaginatedOrdersResponse },
      GetOrdersParams | void
    >({
      query: (params) =>
        buildApiUrl("/order", {
          page: params?.page,
          limit: params?.limit,
        }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<{ data: OrderResponse }, string>({
      query: (orderId) => `/order/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useGetPaymentKeyQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
} = orderApi;
