"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetCurrentUserQuery } from "@/store/api/auth.api";
import {
  useCreateOrderMutation,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/store/api/order.api";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "@/store/slices/cart.slice";
import { calculateOrderTotal } from "@/lib/helpers";
import {
  useRazorpay,
  type RazorpaySuccessResponse,
  UserCheck,
  CheckoutForm,
  type CheckoutFormData,
  OrderSummary,
} from "@/features/checkout";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: userData } = useGetCurrentUserQuery(undefined);
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitiatePaymentMutation();
  const [verifyPayment, { isLoading: isVerifyingPayment }] =
    useVerifyPaymentMutation();
  const { isLoaded: isRazorpayLoaded, openPayment } = useRazorpay();

  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const user = userData?.data as
    | { _id: string; name: string; email: string }
    | undefined;

  const handleFormChange = useCallback(
    (data: CheckoutFormData, isValid: boolean) => {
      setFormData(data);
      setIsFormValid(isValid);
    },
    []
  );

  const handleStateChange = useCallback((state: string) => {
    setSelectedState(state);
  }, []);

  const handlePlaceOrder = async () => {
    if (!formData || !isFormValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const pricing = calculateOrderTotal(subtotal, selectedState);
    const orderItems = cartItems.map((item) => ({
      posterId: item.posterId,
      quantity: item.quantity,
      price: item.price,
    }));

    const shippingAddress = {
      addressLine1: formData.addressLine1,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const customerInfo = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone,
    };

    // Handle COD orders directly
    if (formData.paymentMethod === "COD") {
      await handleCODOrder(orderItems, shippingAddress, customerInfo, pricing);
      return;
    }

    // Handle Online Payment via Razorpay
    await handleOnlinePayment(
      orderItems,
      shippingAddress,
      customerInfo,
      pricing
    );
  };

  const handleCODOrder = async (
    orderItems: { posterId: string; quantity: number; price: number }[],
    shippingAddress: {
      addressLine1: string;
      city: string;
      state: string;
      pincode: string;
    },
    customerInfo: { name: string; email?: string; phone: string },
    pricing: ReturnType<typeof calculateOrderTotal>
  ) => {
    setIsProcessing(true);
    try {
      const orderData = {
        customer: customerInfo,
        items: orderItems,
        shippingAddress,
        paymentDetails: {
          method: "COD" as const,
          amount: pricing.totalPrice,
          currency: "INR" as const,
        },
        shippingCost: pricing.shippingCost,
        taxAmount: pricing.taxAmount,
        totalPrice: pricing.totalPrice,
        notes: formData?.notes || undefined,
      };

      const result = await createOrder(orderData).unwrap();

      if (result) {
        dispatch(clearCart());
        toast.success("Order placed successfully! 🎉");
        router.push(`/myorder/${result.data._id}`);
      }
    } catch (error: unknown) {
      console.error("Order creation failed:", error);
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async (
    orderItems: { posterId: string; quantity: number; price: number }[],
    shippingAddress: {
      addressLine1: string;
      city: string;
      state: string;
      pincode: string;
    },
    customerInfo: { name: string; email?: string; phone: string },
    pricing: ReturnType<typeof calculateOrderTotal>
  ) => {
    if (!isRazorpayLoaded) {
      toast.error("Payment system is loading. Please try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Initiate payment and get Razorpay order
      const paymentResponse = await initiatePayment({
        items: orderItems,
        shippingAddress,
        shippingCost: pricing.shippingCost,
        taxAmount: pricing.taxAmount,
        totalPrice: pricing.totalPrice,
      }).unwrap();

      const { orderId, amount, currency, keyId } = paymentResponse.data;

      // Step 2: Open Razorpay checkout
      openPayment({
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Poster Parlor",
        description: `Order for ${orderItems.length} item(s)`,
        order_id: orderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
        handler: async (response: RazorpaySuccessResponse) => {
          // Step 3: Verify payment and create order
          try {
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer: customerInfo,
              items: orderItems,
              shippingAddress,
              shippingCost: pricing.shippingCost,
              taxAmount: pricing.taxAmount,
              totalPrice: pricing.totalPrice,
              notes: formData?.notes,
            }).unwrap();

            dispatch(clearCart());
            toast.success("Payment successful! Order placed 🎉");
            router.push(`/myorder/${verifyResult.data._id}`);
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            toast.error(
              "Payment verification failed. Please contact support with your payment ID."
            );
          } finally {
            setIsProcessing(false);
          }
        },
      });
    } catch (error: unknown) {
      console.error("Payment initiation failed:", error);
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to initiate payment. Please try again."
      );
      setIsProcessing(false);
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="p-6 rounded-full bg-muted mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven&apos;t added any posters to your cart yet.
            Browse our collection and find something you love!
          </p>
          <Link href="/shop">
            <Button size="lg">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Browse Posters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground mt-1">
            Complete your order and we&apos;ll ship your posters right away
          </p>
        </div>

        {/* Main Content */}
        <UserCheck>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-7 xl:col-span-8">
              <CheckoutForm
                onFormChange={handleFormChange}
                onStateChange={handleStateChange}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-8">
                <OrderSummary
                  selectedState={selectedState}
                  onProceedToPayment={handlePlaceOrder}
                  isProcessing={
                    isProcessing ||
                    isCreatingOrder ||
                    isInitiatingPayment ||
                    isVerifyingPayment
                  }
                />
              </div>
            </div>
          </div>
        </UserCheck>
      </div>
    </div>
  );
}
