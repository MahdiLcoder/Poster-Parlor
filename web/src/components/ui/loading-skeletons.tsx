import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface TableLoadingSkeletonProps {
  /** Number of rows to display */
  rows?: number;
  /** Height of each row */
  rowHeight?: string;
  /** Additional className */
  className?: string;
}

/**
 * Table Loading Skeleton
 *
 * A reusable skeleton loading state for tables.
 *
 * @example
 * <TableLoadingSkeleton rows={5} />
 */
export function TableLoadingSkeleton({
  rows = 5,
  rowHeight = "h-16",
  className,
}: TableLoadingSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full", rowHeight)} />
      ))}
    </div>
  );
}

export interface GridLoadingSkeletonProps {
  /** Number of items to display */
  count?: number;
  /** Grid columns configuration */
  columns?: string;
  /** Additional className */
  className?: string;
}

/**
 * Grid Loading Skeleton
 *
 * A reusable skeleton loading state for poster/product grids.
 *
 * @example
 * <GridLoadingSkeleton count={12} />
 */
export function GridLoadingSkeleton({
  count = 12,
  columns = "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
  className,
}: GridLoadingSkeletonProps) {
  return (
    <div className={cn("grid gap-4 sm:gap-6", columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="group overflow-hidden">
          <Skeleton className="aspect-[3/4] w-full rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

export interface CardLoadingSkeletonProps {
  /** Number of cards to display */
  count?: number;
  /** Card height */
  height?: string;
  /** Grid columns */
  columns?: string;
  /** Additional className */
  className?: string;
}

/**
 * Card Loading Skeleton
 *
 * A reusable skeleton loading state for card grids.
 *
 * @example
 * <CardLoadingSkeleton count={4} height="h-32" />
 */
export function CardLoadingSkeleton({
  count = 4,
  height = "h-32",
  columns = "grid-cols-2 lg:grid-cols-4",
  className,
}: CardLoadingSkeletonProps) {
  return (
    <div className={cn("grid gap-4", columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={height} />
      ))}
    </div>
  );
}
