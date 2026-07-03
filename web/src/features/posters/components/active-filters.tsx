"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FilterBadge } from "./filter-badge";
import { FilterState } from "../types";

interface ActiveFiltersProps {
  filters: FilterState;
  activeFiltersCount: number;
  onRemoveFilter: (key: keyof FilterState) => void;
  onRemoveTag: (tag: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  activeFiltersCount,
  onRemoveFilter,
  onRemoveTag,
  onClearAll,
}: ActiveFiltersProps) {
  if (activeFiltersCount === 0) return null;

  return (
    <div className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
        Active filters:
      </span>
      {filters.search && (
        <FilterBadge
          label={`Search: ${filters.search}`}
          onRemove={() => onRemoveFilter("search")}
        />
      )}
      {filters.category && (
        <FilterBadge
          label={filters.category}
          onRemove={() => onRemoveFilter("category")}
        />
      )}
      {filters.material && (
        <FilterBadge
          label={filters.material}
          onRemove={() => onRemoveFilter("material")}
        />
      )}
      {filters.dimensions && (
        <FilterBadge
          label={filters.dimensions}
          onRemove={() => onRemoveFilter("dimensions")}
        />
      )}
      {filters.selectedTags.map((tag) => (
        <FilterBadge
          key={tag}
          label={`#${tag}`}
          onRemove={() => onRemoveTag(tag)}
        />
      ))}
      {activeFiltersCount > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs sm:h-8 sm:text-sm"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
