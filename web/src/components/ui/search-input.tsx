"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Current search value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Show loading indicator */
  isLoading?: boolean;
  /** Show clear button when there's text */
  showClear?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional className for the wrapper */
  wrapperClassName?: string;
}

/**
 * Search Input Component
 *
 * A reusable search input with icon, loading state, and clear button.
 *
 * @example
 * <SearchInput
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search products..."
 *   isLoading={isFetching}
 * />
 */
export function SearchInput({
  value,
  onChange,
  isLoading = false,
  showClear = true,
  placeholder = "Search...",
  wrapperClassName,
  className,
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={cn("relative flex-1", wrapperClassName)}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("pl-10 pr-10", className)}
        {...props}
      />
      {showClear && value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
