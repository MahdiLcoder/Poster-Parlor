"use client";

import Link from "next/link";
import { formatPrice, formatDate, formatOrderId } from "@/lib/helpers";
import type { OrderResponse } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { Package, Eye } from "lucide-react";

interface OrderListProps {
  orders: OrderResponse[];
  isLoading?: boolean;
}

// Loading skeleton
function OrderListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile card view for orders
function OrderCard({ order }: { order: OrderResponse }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-sm">
              Order {formatOrderId(order._id)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
            <p className="text-xs text-muted-foreground">
              {order.isPaid ? "Paid" : "Unpaid"}
            </p>
          </div>
        </div>

        <Link href={`/myorder/${order._id}`}>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Desktop table view
function OrderTable({ orders }: { orders: OrderResponse[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const itemCount = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return (
            <TableRow key={order._id}>
              <TableCell className="font-medium">
                {formatOrderId(order._id)}
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </TableCell>
              <TableCell className="font-semibold">
                {formatPrice(order.totalPrice)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <Badge variant={order.isPaid ? "default" : "outline"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/myorder/${order._id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function OrderList({ orders, isLoading }: OrderListProps) {
  if (isLoading) {
    return <OrderListSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">No orders yet</CardTitle>
          <CardDescription className="text-center mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here!
          </CardDescription>
          <Link href="/posters">
            <Button>Browse Posters</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Your Orders
        </CardTitle>
        <CardDescription>
          View and track all your orders in one place
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop view */}
        <div className="hidden md:block">
          <OrderTable orders={orders} />
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
