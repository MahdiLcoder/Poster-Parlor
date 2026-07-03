"use client";

import { use } from "react";
import { useGetCurrentUserQuery } from "@/store/api/auth.api";
import { useGetOrderByIdQuery } from "@/store/api/order.api";
import { OrderDetail } from "@/features/orders";
import { GoogleSignInButton } from "@/features/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);

  // Check if user is authenticated
  const { data: userData, isLoading: isUserLoading } =
    useGetCurrentUserQuery(undefined);
  const user = userData?.data;

  // Fetch order details
  const {
    data: orderData,
    isLoading: isOrderLoading,
    error,
  } = useGetOrderByIdQuery(id, { skip: !user });

  // Loading state for user check
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900">
                    <Shield className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <CardTitle>Sign in to View Order</CardTitle>
                <CardDescription>
                  Sign in with your Google account to view your order details.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <GoogleSignInButton />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const order = orderData?.data || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <OrderDetail order={order} isLoading={isOrderLoading} />
      </div>
    </div>
  );
}
