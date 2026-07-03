"use client";

import * as React from "react";
import {
  Clock,
  Loader2,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ReactNode;
  color: string; // For custom colored badges
}

const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  SHIPPED: {
    label: "Shipped",
    variant: "default",
    icon: <Truck className="h-3 w-3" />,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  DELIVERED: {
    label: "Delivered",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export interface OrderStatusBadgeProps {
  /** Order status */
  status: OrderStatus;
  /** Show icon */
  showIcon?: boolean;
  /** Use custom colors instead of badge variants */
  useCustomColors?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Order Status Badge Component
 *
 * A unified status badge for displaying order status across the application.
 *
 * @example
 * // With icon and variant
 * <OrderStatusBadge status="PROCESSING" showIcon />
 *
 * // With custom colors (for dashboard tables)
 * <OrderStatusBadge status="DELIVERED" useCustomColors />
 */
export function OrderStatusBadge({
  status,
  showIcon = true,
  useCustomColors = false,
  className,
}: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status] || orderStatusConfig.PENDING;

  if (useCustomColors) {
    return (
      <Badge className={cn(config.color, "gap-1", className)}>
        {showIcon && config.icon}
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}

/**
 * Get status config for custom rendering
 */
export function getOrderStatusConfig(status: OrderStatus) {
  return orderStatusConfig[status] || orderStatusConfig.PENDING;
}

// Payment status badge
export interface PaymentStatusBadgeProps {
  isPaid: boolean;
  className?: string;
}

export function PaymentStatusBadge({
  isPaid,
  className,
}: PaymentStatusBadgeProps) {
  return (
    <Badge variant={isPaid ? "default" : "outline"} className={className}>
      {isPaid ? "Paid" : "Unpaid"}
    </Badge>
  );
}

// Stock status badge
export interface StockStatusBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockStatusBadge({
  stock,
  lowStockThreshold = 10,
  className,
}: StockStatusBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className={className}>
        Out of Stock
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-yellow-500 text-yellow-600 dark:text-yellow-400",
          className
        )}
      >
        Low Stock ({stock})
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={className}>
      In Stock ({stock})
    </Badge>
  );
}

// Active/Inactive status badge
export interface ActiveStatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export function ActiveStatusBadge({
  isActive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className,
}: ActiveStatusBadgeProps) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        className
      )}
    >
      {isActive ? activeLabel : inactiveLabel}
    </Badge>
  );
}
