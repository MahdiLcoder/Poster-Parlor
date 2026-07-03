"use client";

import Link from "next/link";
import Image from "next/image";
import {
  formatPrice,
  formatDate,
  formatOrderId,
  formatPosterId,
} from "@/lib/helpers";
import type { OrderResponse, OrderItemDto, PopulatedPoster } from "../types";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Receipt,
  Copy,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailProps {
  order: OrderResponse | null;
  isLoading?: boolean;
}

// Helper to check if posterId is populated
function isPopulatedPoster(
  posterId: string | PopulatedPoster
): posterId is PopulatedPoster {
  return typeof posterId === "object" && posterId !== null && "_id" in posterId;
}

// Helper to get poster ID string
function getPosterId(item: OrderItemDto): string {
  return isPopulatedPoster(item.posterId) ? item.posterId._id : item.posterId;
}

// Helper to get poster image URL
function getPosterImage(item: OrderItemDto): string | null {
  if (isPopulatedPoster(item.posterId) && item.posterId.images?.length > 0) {
    return item.posterId.images[0].url;
  }
  return null;
}

// Helper to get poster title
function getPosterTitle(item: OrderItemDto): string {
  if (isPopulatedPoster(item.posterId)) {
    return item.posterId.title;
  }
  return formatPosterId(item.posterId);
}

// Helper to get poster details
function getPosterDetails(item: OrderItemDto): string | null {
  if (isPopulatedPoster(item.posterId)) {
    const details = [];
    if (item.posterId.dimensions) details.push(item.posterId.dimensions);
    if (item.posterId.material) details.push(item.posterId.material);
    return details.length > 0 ? details.join(" • ") : null;
  }
  return null;
}

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-16" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OrderDetail({ order, isLoading }: OrderDetailProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">Order not found</CardTitle>
          <CardDescription className="mb-6">
            The order you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </CardDescription>
          <Link href="/myorder">
            <Button>Back to Orders</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const copyOrderId = async () => {
    await navigator.clipboard.writeText(order._id);
    setCopied(true);
    toast.success("Order ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const itemSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/myorder">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              Order {formatOrderId(order._id)}
            </h1>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyOrderId}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const posterId = getPosterId(item);
                  const imageUrl = getPosterImage(item);
                  const title = getPosterTitle(item);
                  const details = getPosterDetails(item);

                  return (
                    <Link
                      key={index}
                      href={`/posters/${posterId}`}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="relative flex h-20 w-16 items-center justify-center rounded-md bg-muted overflow-hidden shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {title}
                          </p>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                        {details && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {details}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="font-medium">{order.customer?.name}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.addressLine1}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                {order.customer?.phone && (
                  <p className="text-muted-foreground">
                    Phone: {order.customer.phone}
                  </p>
                )}
                {order.customer?.email && (
                  <p className="text-muted-foreground">
                    Email: {order.customer.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info (if available) */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <p className="text-muted-foreground">Tracking Number:</p>
                  <Badge variant="outline" className="font-mono">
                    {order.trackingNumber}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <Badge variant="outline">
                  {order.paymentDetails.method === "COD"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={order.isPaid ? "default" : "outline"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(itemSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shippingCost === 0
                    ? "FREE"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Link href="/myorder" className="block">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                  </Button>
                </Link>
                <Link href="/posters" className="block">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
