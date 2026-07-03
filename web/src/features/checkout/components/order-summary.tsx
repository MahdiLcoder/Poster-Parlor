"use client";

import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalItems,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  CartItem,
} from "@/store/slices/cart.slice";
import {
  formatPrice,
  calculateOrderTotal,
  getShippingMessage,
  REMOTE_STATES,
} from "@/lib/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Package,
  Truck,
  Receipt,
  AlertCircle,
  MapPin,
} from "lucide-react";

interface OrderSummaryProps {
  selectedState: string;
  onProceedToPayment?: () => void;
  isProcessing?: boolean;
}

export function OrderSummary({
  selectedState,
  onProceedToPayment,
  isProcessing = false,
}: OrderSummaryProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const totalItems = useAppSelector(selectCartTotalItems);

  const pricing = calculateOrderTotal(subtotal, selectedState);
  const shippingMessage = getShippingMessage(subtotal);
  const isRemoteState = REMOTE_STATES.includes(
    selectedState as (typeof REMOTE_STATES)[number]
  );

  const handleRemoveItem = (posterId: string) => {
    dispatch(removeFromCart(posterId));
  };

  const handleIncrement = (posterId: string) => {
    dispatch(incrementQuantity(posterId));
  };

  const handleDecrement = (posterId: string) => {
    dispatch(decrementQuantity(posterId));
  };

  if (cartItems.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground text-center">
            Add some posters to your cart to proceed with checkout
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <CardTitle>Order Summary</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
        <CardDescription>
          Review your items before completing your order
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6 space-y-4">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item: CartItem) => (
            <div
              key={item.posterId}
              className="flex gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {/* Item Image */}
              <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Item Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="font-medium line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.dimensions} • {item.material}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleDecrement(item.posterId)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleIncrement(item.posterId)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveItem(item.posterId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Shipping Message */}
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            pricing.freeShippingEligible
              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
          }`}
        >
          <Truck className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">{shippingMessage}</span>
        </div>

        {/* Remote State Warning */}
        {isRemoteState && selectedState && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Remote location:</span> Additional
              ₹150 shipping charge for {selectedState}
            </div>
          </div>
        )}

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Subtotal</span>
            </div>
            <span>{formatPrice(pricing.subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Shipping</span>
            </div>
            <span
              className={
                pricing.shippingCost === 0 ? "text-green-600 font-medium" : ""
              }
            >
              {pricing.shippingCost === 0
                ? "FREE"
                : formatPrice(pricing.shippingCost)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span>GST (18%)</span>
            </div>
            <span>{formatPrice(pricing.taxAmount)}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">
              {formatPrice(pricing.totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>

      {onProceedToPayment && (
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            size="lg"
            onClick={onProceedToPayment}
            disabled={isProcessing || cartItems.length === 0}
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>Place Order • {formatPrice(pricing.totalPrice)}</>
            )}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <span>
              By placing this order, you agree to our terms and conditions
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
