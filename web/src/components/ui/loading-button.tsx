"use client";

import * as React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export interface LoadingButtonProps extends ButtonProps {
  /** Whether the button is in loading state */
  isLoading?: boolean;
  /** Text to show while loading (optional, defaults to children) */
  loadingText?: string;
  /** Custom loading icon */
  loadingIcon?: React.ReactNode;
  /** Icon to show before text when not loading */
  icon?: LucideIcon;
}

/**
 * Loading Button Component
 *
 * A button that shows a loading spinner when in loading state.
 *
 * @example
 * <LoadingButton
 *   isLoading={isSubmitting}
 *   loadingText="Saving..."
 *   icon={Save}
 * >
 *   Save Changes
 * </LoadingButton>
 */
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    {
      isLoading = false,
      loadingText,
      loadingIcon,
      icon: Icon,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        {...props}
      >
        {isLoading ? (
          <>
            {loadingIcon || <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loadingText || children}
          </>
        ) : (
          <>
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {children}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
