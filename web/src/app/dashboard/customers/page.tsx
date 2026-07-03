"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SmartPagination } from "@/components/ui/smart-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { SearchInput } from "@/components/ui/search-input";
import { PageHeader } from "@/components/ui/page-header";
import { ActiveStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Calendar, ShoppingBag, RefreshCw } from "lucide-react";
import { useGetCustomersQuery } from "@/store/api/admin.api";
import { formatRelativeTime, formatPrice } from "@/lib/helpers";

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error, refetch, isFetching } = useGetCustomersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
  });

  const customers = data?.data?.customers || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalCustomers = pagination?.totalCustomers || 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-destructive">Failed to load customers</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Customers"
        description="Manage your customer base"
        showRefresh
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search customers by name or email..."
            isLoading={isFetching}
          />
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customers ({totalCustomers})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableLoadingSkeleton rows={5} />
          ) : customers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              description={
                debouncedSearch ? "Try adjusting your search" : undefined
              }
              size="sm"
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {customer.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {customer.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {customer.orderCount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(customer.totalSpent)}
                      </TableCell>
                      <TableCell>
                        <ActiveStatusBadge isActive={customer.isActive} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatRelativeTime(customer.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <SmartPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCustomers}
        itemLabel="customers"
        onPageChange={setCurrentPage}
        className="justify-center"
      />
    </div>
  );
}
