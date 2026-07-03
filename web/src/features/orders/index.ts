// Components
export { OrderList } from "./components/order-list";
export { OrderDetail } from "./components/order-detail";

// Re-export centralized utilities and components for convenience
export { OrderStatusBadge } from "@/components/ui/status-badge";
export { formatDate, formatOrderId } from "@/lib/helpers";

// Types
export type {
  OrderResponse,
  OrderStatus,
  OrderItemDto,
  PopulatedPoster,
  PaginationInfo,
} from "./types";
