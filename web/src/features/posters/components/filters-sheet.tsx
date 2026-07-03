"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FilterState } from "../types";

interface FilterSheetProps {
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

export function FilterSheet({
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
}: FilterSheetProps) {
  return (
    <Sheet open={showFilters} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative gap-2 h-11 sm:h-12 px-3 sm:px-6 shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="absolute -right-1 sm:-right-2 -top-1 sm:-top-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto p-0"
      >
        <SheetHeader className="text-left space-y-2 p-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold">Filter Options</SheetTitle>
          <SheetDescription>
            Refine your search with advanced filtering
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6">
          {/* Category */}
          <FilterSelect
            id="category"
            label="Category"
            value={tempFilters.category}
            placeholder="All categories"
            options={categories}
            onChange={(value) =>
              setTempFilters((prev) => ({
                ...prev,
                category: value === "all" ? "" : value,
              }))
            }
          />

          {/* Material */}
          <FilterSelect
            id="material"
            label="Material"
            value={tempFilters.material}
            placeholder="All materials"
            options={materials}
            onChange={(value) =>
              setTempFilters((prev) => ({
                ...prev,
                material: value === "all" ? "" : value,
              }))
            }
          />

          {/* Dimensions */}
          <FilterSelect
            id="dimensions"
            label="Dimensions"
            value={tempFilters.dimensions}
            placeholder="All sizes"
            options={dimensionOptions}
            onChange={(value) =>
              setTempFilters((prev) => ({
                ...prev,
                dimensions: value === "all" ? "" : value,
              }))
            }
          />

          <Separator />

          {/* Price Range */}
          <RangeInput
            label="Price Range (₹)"
            minValue={tempFilters.minPrice}
            maxValue={tempFilters.maxPrice}
            onMinChange={(value) =>
              setTempFilters((prev) => ({ ...prev, minPrice: value }))
            }
            onMaxChange={(value) =>
              setTempFilters((prev) => ({ ...prev, maxPrice: value }))
            }
          />

          {/* Stock Range */}
          <RangeInput
            label="Stock Range"
            minValue={tempFilters.minStock}
            maxValue={tempFilters.maxStock}
            onMinChange={(value) =>
              setTempFilters((prev) => ({ ...prev, minStock: value }))
            }
            onMaxChange={(value) =>
              setTempFilters((prev) => ({ ...prev, maxStock: value }))
            }
          />

          {/* Availability */}
          <div className="space-y-2.5">
            <Label htmlFor="availability" className="text-sm font-semibold">
              Availability
            </Label>
            <Select
              value={
                tempFilters.isAvailable === undefined
                  ? "all"
                  : tempFilters.isAvailable.toString()
              }
              onValueChange={(value) =>
                setTempFilters((prev) => ({
                  ...prev,
                  isAvailable: value === "all" ? undefined : value === "true",
                }))
              }
            >
              <SelectTrigger id="availability" className="h-11">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        tempFilters.selectedTags.includes(tag)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer transition-all hover:scale-105 px-3 py-1.5"
                      onClick={() => toggleTempTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-3 flex-col sm:flex-row p-6 pt-4 border-t">
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="h-11 flex-1"
          >
            Clear All
          </Button>
          <Button onClick={onApplyFilters} className="h-11 flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Sub-components for FilterSheet
interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <Select value={value || "all"} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-11">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface RangeInputProps {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function RangeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: RangeInputProps) {
  return (
    <div className="space-y-2.5">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder="Min"
          className="h-11"
        />
        <Input
          type="number"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="h-11"
        />
      </div>
    </div>
  );
}
