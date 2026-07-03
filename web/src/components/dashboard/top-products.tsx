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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, TrendingUp } from "lucide-react";
import { useGetTopProductsQuery } from "@/store/api/admin.api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export function TopProducts() {
  const { data, isLoading, error } = useGetTopProductsQuery(5);
  const products = data?.data || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
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
          <CardTitle className="text-lg font-semibold">
            Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Failed to load products
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Best Selling Products
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Top performers by units sold
          </p>
        </div>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No sales data yet
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.totalSold} sold · ₹
                    {product.totalRevenue.toLocaleString()} revenue
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
