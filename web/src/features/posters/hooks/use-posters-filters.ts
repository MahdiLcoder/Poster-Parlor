import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { FilterState } from "../types";
import { PosterFilter } from "@/store/api/inventory.api";

export function usePostersFilters() {
  const searchParams = useSearchParams();

  const initializeFilters = (): FilterState => {
    const urlCategory = searchParams?.get("category");
    return {
      search: "",
      category: urlCategory ? decodeURIComponent(urlCategory) : "",
      material: "",
      dimensions: "",
      isAvailable: undefined,
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: "",
      selectedTags: [],
    };
  };

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<
    "price" | "stock" | "createdAt" | "title" | ""
  >("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [filters, setFilters] = useState<FilterState>(initializeFilters);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => {
    const apiFilters: PosterFilter = {};

    if (filters.search) apiFilters.search = filters.search;
    if (filters.category) apiFilters.category = filters.category;
    if (filters.material) apiFilters.material = filters.material;
    if (filters.dimensions) apiFilters.dimensions = filters.dimensions;
    if (filters.isAvailable !== undefined)
      apiFilters.isAvailable = filters.isAvailable;
    if (filters.minPrice) apiFilters.minPrice = parseFloat(filters.minPrice);
    if (filters.maxPrice) apiFilters.maxPrice = parseFloat(filters.maxPrice);
    if (filters.minStock) apiFilters.minStock = parseInt(filters.minStock);
    if (filters.maxStock) apiFilters.maxStock = parseInt(filters.maxStock);
    if (filters.selectedTags.length > 0)
      apiFilters.tags = filters.selectedTags.join(",");
    if (sortBy) apiFilters.sortBy = sortBy;
    if (sortOrder) apiFilters.sortOrder = sortOrder;

    return { page, limit, filters: apiFilters };
  }, [filters, page, limit, sortBy, sortOrder]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.search,
      filters.category,
      filters.material,
      filters.dimensions,
      filters.isAvailable !== undefined,
      filters.minPrice,
      filters.maxPrice,
      filters.minStock,
      filters.maxStock,
      filters.selectedTags.length > 0,
    ].filter(Boolean).length;
  }, [filters]);

  const handleApplyFilters = useCallback(() => {
    setFilters(tempFilters);
    setPage(1);
    setShowFilters(false);
  }, [tempFilters]);

  const handleClearFilters = useCallback(() => {
    const clearedState: FilterState = {
      search: "",
      category: "",
      material: "",
      dimensions: "",
      isAvailable: undefined,
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: "",
      selectedTags: [],
    };
    setFilters(clearedState);
    setTempFilters(clearedState);
    setPage(1);
    setShowFilters(false);
  }, []);

  const handleRemoveFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "selectedTags" ? [] : key === "isAvailable" ? undefined : "",
    }));
  }, []);

  const handleRemoveTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((t) => t !== tag),
    }));
  }, []);

  const toggleTempTag = useCallback((tag: string) => {
    setTempFilters((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  }, []);

  const handleOpenSheet = useCallback(
    (open: boolean) => {
      if (open) {
        setTempFilters(filters);
      }
      setShowFilters(open);
    },
    [filters]
  );

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleSortByChange = useCallback((value: string) => {
    setSortBy(value === "default" ? "" : (value as typeof sortBy));
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback((value: string) => {
    setSortOrder(value === "default" ? "" : (value as typeof sortOrder));
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((value: string) => {
    setLimit(Number(value));
    setPage(1);
  }, []);

  return {
    // State
    page,
    limit,
    sortBy,
    sortOrder,
    filters,
    tempFilters,
    showFilters,
    queryParams,
    activeFiltersCount,
    // Setters
    setPage,
    setTempFilters,
    // Handlers
    handleApplyFilters,
    handleClearFilters,
    handleRemoveFilter,
    handleRemoveTag,
    toggleTempTag,
    handleOpenSheet,
    handleSearchChange,
    handleSortByChange,
    handleSortOrderChange,
    handleLimitChange,
  };
}
