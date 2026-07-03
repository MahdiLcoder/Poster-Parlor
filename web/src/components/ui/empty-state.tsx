import * as React from "react";
import { Button } from "@/components/ui/button";
import { Package, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icon to display (defaults to Package) */
  icon?: LucideIcon;
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Secondary action label */
  secondaryActionLabel?: string;
  /** Secondary action callback */
  onSecondaryAction?: () => void;
  /** Additional className */
  className?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
}

/**
 * Empty State Component
 *
 * A reusable component for displaying empty states with optional action buttons.
 *
 * @example
 * // Basic usage
 * <EmptyState
 *   title="No posters found"
 *   description="Try adjusting your filters"
 *   actionLabel="Clear Filters"
 *   onAction={() => clearFilters()}
 * />
 *
 * @example
 * // With custom icon
 * <EmptyState
 *   icon={ShoppingCart}
 *   title="Your cart is empty"
 *   description="Start shopping to add items"
 *   actionLabel="Browse Posters"
 *   onAction={() => router.push('/posters')}
 * />
 */
export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  size = "default",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      wrapper: "py-8 sm:py-12",
      iconWrapper: "p-3 sm:p-4 mb-3 sm:mb-4",
      icon: "h-8 w-8 sm:h-10 sm:w-10",
      title: "text-lg sm:text-xl",
      description: "text-sm",
    },
    default: {
      wrapper: "py-12 sm:py-16",
      iconWrapper: "p-4 sm:p-6 mb-4 sm:mb-6",
      icon: "h-12 w-12 sm:h-16 sm:w-16",
      title: "text-2xl sm:text-3xl",
      description: "text-base sm:text-lg",
    },
    lg: {
      wrapper: "py-20 sm:py-32",
      iconWrapper: "p-6 sm:p-8 mb-6 sm:mb-8",
      icon: "h-16 w-16 sm:h-20 sm:w-20",
      title: "text-3xl sm:text-4xl",
      description: "text-lg sm:text-xl",
    },
  };

  const styles = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        styles.wrapper,
        className
      )}
    >
      <div className={cn("rounded-full bg-muted/50", styles.iconWrapper)}>
        <Icon className={cn("text-muted-foreground", styles.icon)} />
      </div>

      <h3 className={cn("font-bold mb-2 sm:mb-3", styles.title)}>{title}</h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground mb-6 sm:mb-8 max-w-md",
            styles.description
          )}
        >
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              variant="outline"
              size={size === "sm" ? "sm" : "lg"}
              className="px-8"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              size={size === "sm" ? "sm" : "lg"}
              className="px-8"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
