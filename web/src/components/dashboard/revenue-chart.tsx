"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetRevenueAnalyticsQuery } from "@/store/api/admin.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RevenueChart() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const { data, isLoading, error } = useGetRevenueAnalyticsQuery(period);
  const analytics = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
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
          <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Failed to load revenue data
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = analytics?.data || [];
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);
  const averageRevenue =
    chartData.length > 0 ? totalRevenue / chartData.length : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
          <p className="text-sm text-muted-foreground">
            {period === "week"
              ? "Last 7 days"
              : period === "month"
              ? "Last 30 days"
              : "Last 12 months"}
          </p>
        </div>
        <div className="flex gap-1">
          {(["week", "month", "year"] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="h-8 px-3"
            >
              {p === "week" ? "7D" : p === "month" ? "30D" : "1Y"}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No revenue data for this period
          </p>
        ) : (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {chartData.map((item, index) => {
                const percentage = (item.revenue / maxRevenue) * 100;
                const label =
                  period === "year"
                    ? new Date(item.date + "-01").toLocaleDateString("en-IN", {
                        month: "short",
                        year: "2-digit",
                      })
                    : new Date(item.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      });

                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-16 shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3",
                          "bg-gradient-to-r from-primary/80 to-primary"
                        )}
                        style={{
                          width: `${Math.max(percentage, 5)}%`,
                        }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs font-semibold text-primary-foreground">
                            ₹{(item.revenue / 1000).toFixed(1)}K
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right w-20 shrink-0">
                      <p className="text-sm font-semibold">
                        ₹{item.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.orders} orders
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Revenue
                </p>
                <p className="text-lg font-bold">
                  ₹{(totalRevenue / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Orders
                </p>
                <p className="text-lg font-bold">{totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg/Day</p>
                <p className="text-lg font-bold">
                  ₹{(averageRevenue / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
