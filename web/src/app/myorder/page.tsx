"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/store/api/auth.api";
import { useGetMyOrdersQuery } from "@/store/api/order.api";
import { OrderList } from "@/features/orders";
import { GoogleSignInButton } from "@/features/auth";
import { SmartPagination } from "@/components/ui/smart-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDERS_PER_PAGE = 10;

export default function MyOrdersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Check if user is authenticated
  const { data: userData, isLoading: isUserLoading } =
    useGetCurrentUserQuery(undefined);
  const user = userData?.data;

  // Fetch orders with pagination
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isFetching,
    refetch,
  } = useGetMyOrdersQuery(
    { page: currentPage, limit: ORDERS_PER_PAGE },
    { skip: !user }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                <CardTitle>Sign in to View Orders</CardTitle>
                <CardDescription>
                  Sign in with your Google account to view your order history
                  and track your purchases.
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

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-8 w-8" />
              My Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              View and track all your orders
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Orders List */}
        <OrderList orders={orders} isLoading={isOrdersLoading || isFetching} />

        {/* Pagination */}
        {pagination && orders.length > 0 && (
          <SmartPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalOrders}
            itemLabel="orders"
            hasPrev={pagination.hasPrevPage}
            hasNext={pagination.hasNextPage}
            onPageChange={handlePageChange}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
