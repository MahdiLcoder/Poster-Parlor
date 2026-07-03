"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  OrderStatusBadge,
  getOrderStatusConfig,
} from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useGetRecentOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/api/admin.api";
import { OrderStatus } from "@/store/api/order.api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice, formatDate, formatOrderId } from "@/lib/helpers";

export function RecentOrders() {
  const { data, isLoading, error } = useGetRecentOrdersQuery(10);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = data?.data || [];

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ orderId, status }).unwrap();
      toast.success(
        `Order status updated to ${getOrderStatusConfig(status).label}`
      );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Failed to load orders
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Link href="/dashboard/orders">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No orders yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {formatOrderId(order._id)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.customer?.name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer?.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/dashboard/orders?view=${order._id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        {order.status === "PENDING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "PROCESSING")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Processing
                          </DropdownMenuItem>
                        )}
                        {order.status === "PROCESSING" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "SHIPPED")
                            }
                          >
                            <Truck className="mr-2 h-4 w-4" />
                            Mark Shipped
                          </DropdownMenuItem>
                        )}
                        {order.status === "SHIPPED" && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(order._id, "DELIVERED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </DropdownMenuItem>
                        )}
                        {(order.status === "PENDING" ||
                          order.status === "PROCESSING") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(order._id, "CANCELLED")
                              }
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
