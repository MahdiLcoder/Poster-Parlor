import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./base.query";
import { OrderResponse, OrderStatus, PaginationInfo } from "./order.api";
import { buildApiUrl } from "@/lib/helpers";

// Dashboard Stats Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

// Customer Types
export interface Customer {
  _id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  googleId: string;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface PaginatedCustomersResponse {
  customers: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Top Product Types
export interface TopProduct {
  _id: string;
  title: string;
  images: { url: string; public_id: string }[];
  price: number;
  stock: number;
  category: string;
  totalSold: number;
  totalRevenue: number;
}

// Revenue Analytics Types
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface RevenueAnalytics {
  period: string;
  data: RevenueDataPoint[];
}

// Admin Orders Response
export interface AdminPaginatedOrdersResponse {
  orders: OrderResponse[];
  pagination: PaginationInfo;
}

// Query Params
export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateOrderStatusDto {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminStats", "AdminOrders", "AdminCustomers", "AdminProducts"],
  endpoints: (builder) => ({
    // Dashboard Stats
    getDashboardStats: builder.query<{ data: DashboardStats }, void>({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),

    // Recent Orders
    getRecentOrders: builder.query<
      { data: OrderResponse[] },
      number | undefined
    >({
      query: (limit) => buildApiUrl("/admin/orders/recent", { limit }),
      providesTags: ["AdminOrders"],
    }),

    // All Orders with pagination and filters
    getAdminOrders: builder.query<
      { data: AdminPaginatedOrdersResponse },
      GetAdminOrdersParams | void
    >({
      query: (params) =>
        buildApiUrl("/admin/orders", {
          page: params?.page,
          limit: params?.limit,
          status: params?.status,
          search: params?.search,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        }),
      providesTags: ["AdminOrders"],
    }),

    // Get Single Order (admin)
    getAdminOrderById: builder.query<{ data: OrderResponse }, string>({
      query: (orderId) => `/admin/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "AdminOrders", id }],
    }),

    // Update Order Status
    updateOrderStatus: builder.mutation<
      { data: OrderResponse },
      UpdateOrderStatusDto
    >({
      query: ({ orderId, status, trackingNumber }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { status, trackingNumber },
      }),
      invalidatesTags: ["AdminOrders", "AdminStats"],
    }),

    // Cancel Order
    cancelOrder: builder.mutation<
      { data: OrderResponse },
      { orderId: string; reason?: string }
    >({
      query: ({ orderId, reason }) => ({
        url: `/admin/orders/${orderId}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["AdminOrders", "AdminStats"],
    }),

    // Delete Order
    deleteOrder: builder.mutation<void, string>({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders", "AdminStats"],
    }),

    // Customers
    getCustomers: builder.query<
      { data: PaginatedCustomersResponse },
      GetCustomersParams | void
    >({
      query: (params) =>
        buildApiUrl("/admin/customers", {
          page: params?.page,
          limit: params?.limit,
          search: params?.search,
        }),
      providesTags: ["AdminCustomers"],
    }),

    // Top Products
    getTopProducts: builder.query<{ data: TopProduct[] }, number | undefined>({
      query: (limit) => buildApiUrl("/admin/products/top", { limit }),
      providesTags: ["AdminProducts"],
    }),

    // Revenue Analytics
    getRevenueAnalytics: builder.query<
      { data: RevenueAnalytics },
      string | undefined
    >({
      query: (period) =>
        `/admin/analytics/revenue${period ? `?period=${period}` : ""}`,
      providesTags: ["AdminStats"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useLazyGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useGetCustomersQuery,
  useGetTopProductsQuery,
  useGetRevenueAnalyticsQuery,
} = adminApi;
