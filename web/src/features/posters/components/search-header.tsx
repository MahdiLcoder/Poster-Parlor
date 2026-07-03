"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterState } from "../types";
import { FilterSheet } from "./filters-sheet";
import { useDebounce } from "../hooks/use-debounce";

interface SearchHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  limit: number;
  onLimitChange: (value: string) => void;
  showFilters: boolean;
  onOpenChange: (open: boolean) => void;
  activeFiltersCount: number;
  tempFilters: FilterState;
  setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  toggleTempTag: (tag: string) => void;
  categories: string[];
  materials: string[];
  dimensionOptions: string[];
  availableTags: string[];
}

export function SearchHeader({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  limit,
  onLimitChange,
  showFilters,
  onOpenChange,
  activeFiltersCount,
  tempFilters,
  setTempFilters,
  onApplyFilters,
  onClearFilters,
  toggleTempTag,
  categories,
  materials,
  dimensionOptions,
  availableTags,
}: SearchHeaderProps) {
  // Local state for immediate input feedback
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce the local search value
  const debouncedSearch = useDebounce(localSearch, 400);

  // Sync local state with parent when searchValue changes externally (e.g., clear filters)
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchValue) {
      onSearchChange(debouncedSearch);
      onSearchSubmit();
    }
    setIsTyping(false);
  }, [debouncedSearch, searchValue, onSearchChange, onSearchSubmit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setIsTyping(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Immediate search on Enter
      onSearchChange(localSearch);
      onSearchSubmit();
      setIsTyping(false);
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-[1800px]">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar with Debouncing */}
          <div className="relative flex-1">
            {isTyping ? (
              <Loader2 className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              type="text"
              value={localSearch}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search posters..."
              className="h-11 sm:h-12 pl-10 sm:pl-12 text-sm sm:text-base"
            />
          </div>

          {/* Sort Controls */}
          <Select value={sortBy || "default"} onValueChange={onSortByChange}>
            <SelectTrigger className="hidden md:flex h-12 w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Random</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder || "default"}
            onValueChange={onSortOrderChange}
          >
            <SelectTrigger className="hidden md:flex h-12 w-[130px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Random</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={limit.toString()} onValueChange={onLimitChange}>
            <SelectTrigger className="hidden md:flex h-12 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 items</SelectItem>
              <SelectItem value="15">15 items</SelectItem>
              <SelectItem value="20">20 items</SelectItem>
              <SelectItem value="25">25 items</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Sheet */}
          <FilterSheet
            showFilters={showFilters}
            onOpenChange={onOpenChange}
            activeFiltersCount={activeFiltersCount}
            tempFilters={tempFilters}
            setTempFilters={setTempFilters}
            onApplyFilters={onApplyFilters}
            onClearFilters={onClearFilters}
            toggleTempTag={toggleTempTag}
            categories={categories}
            materials={materials}
            dimensionOptions={dimensionOptions}
            availableTags={availableTags}
          />
        </div>
      </div>
    </div>
  );
}
