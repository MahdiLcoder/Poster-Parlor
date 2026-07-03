"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface SmartPaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total items count (optional, for display) */
  totalItems?: number;
  /** Label for items (e.g., "orders", "products", "posters") */
  itemLabel?: string;
  /** Whether there's a previous page */
  hasPrev?: boolean;
  /** Whether there's a next page */
  hasNext?: boolean;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Maximum visible page numbers (default: 5) */
  maxVisiblePages?: number;
  /** Show page info text (default: true) */
  showPageInfo?: boolean;
  /** Additional className for the wrapper */
  className?: string;
}

/**
 * Smart Pagination Component
 *
 * A reusable pagination component that handles:
 * - Page number generation with ellipsis
 * - Previous/Next navigation
 * - Optional page info display
 * - Responsive design
 *
 * @example
 * <SmartPagination
 *   currentPage={1}
 *   totalPages={10}
 *   totalItems={100}
 *   itemLabel="orders"
 *   onPageChange={(page) => setPage(page)}
 * />
 */
export function SmartPagination({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = "items",
  hasPrev,
  hasNext,
  onPageChange,
  maxVisiblePages = 5,
  showPageInfo = true,
  className,
}: SmartPaginationProps) {
  // Don't render if only one page or less
  if (totalPages <= 1) return null;

  // Calculate hasPrev/hasNext if not provided
  const canGoPrev = hasPrev ?? currentPage > 1;
  const canGoNext = hasNext ?? currentPage < totalPages;

  // Generate page numbers to display with ellipsis
  const getPageNumbers = (): (number | "ellipsis-start" | "ellipsis-end")[] => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      const halfVisible = Math.floor((maxVisiblePages - 2) / 2);
      let start = Math.max(2, currentPage - halfVisible);
      let end = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust range if at the edges
      if (currentPage <= halfVisible + 1) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      } else if (currentPage >= totalPages - halfVisible) {
        start = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      // Add ellipsis before middle pages if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {showPageInfo && (
        <p className="text-sm text-muted-foreground">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
          {totalItems !== undefined && (
            <span className="ml-1">
              ({totalItems.toLocaleString()} {itemLabel})
            </span>
          )}
        </p>
      )}

      <Pagination>
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePrevious}
              className={cn(
                !canGoPrev && "pointer-events-none opacity-50",
                canGoPrev && "cursor-pointer"
              )}
              aria-disabled={!canGoPrev}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={page} className="hidden sm:flex">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page} className="hidden sm:flex">
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={handlePageClick(page)}
                  className={cn(
                    "cursor-pointer",
                    page === currentPage && "pointer-events-none"
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNext}
              className={cn(
                !canGoNext && "pointer-events-none opacity-50",
                canGoNext && "cursor-pointer"
              )}
              aria-disabled={!canGoNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
