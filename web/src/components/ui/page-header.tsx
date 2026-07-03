"use client";

import * as React from "react";
import { RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description text */
  description?: string;
  /** Icon to display next to title */
  icon?: LucideIcon;
  /** Show refresh button */
  showRefresh?: boolean;
  /** Refresh button callback */
  onRefresh?: () => void;
  /** Is currently refreshing/loading */
  isRefreshing?: boolean;
  /** Additional actions to render on the right */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Page Header Component
 *
 * A reusable page header with title, description, and optional refresh button.
 *
 * @example
 * <PageHeader
 *   title="Products"
 *   description="Manage your product inventory"
 *   icon={Package}
 *   showRefresh
 *   onRefresh={() => refetch()}
 *   isRefreshing={isFetching}
 *   actions={<Button>Add Product</Button>}
 * />
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  showRefresh = false,
  onRefresh,
  isRefreshing = false,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          {Icon && <Icon className="h-8 w-8" />}
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showRefresh && onRefresh && (
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        )}
        {actions}
      </div>
    </div>
  );
}
