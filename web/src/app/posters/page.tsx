"use client";

import React, { Suspense, useMemo } from "react";
import {
  useGetAllInventoryQuery,
  useGetAllFiltersQuery,
} from "@/store/api/inventory.api";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { GridLoadingSkeleton } from "@/components/ui/loading-skeletons";
import { SmartPagination } from "@/components/ui/smart-pagination";

import {
  usePostersFilters,
  SearchHeader,
  ActiveFilters,
  PostersGrid,
} from "@/features/posters";

function PostersContent() {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    filters,
    tempFilters,
    showFilters,
    queryParams,
    activeFiltersCount,
    setPage,
    setTempFilters,
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
  } = usePostersFilters();

  // Fetch data
  const { data, error, isLoading, isFetching } =
    useGetAllInventoryQuery(queryParams);
  const { data: filtersData } = useGetAllFiltersQuery();

  // Extract data
  const posters = data?.data?.posters || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.pages || 1;

  // Available filter options
  const categories = useMemo(() => {
    const cats = filtersData?.data?.categories || [];
    return cats.map((cat: string | { category: string; count: number }) =>
      typeof cat === "string" ? cat : cat.category
    );
  }, [filtersData]);

  const materials = filtersData?.data?.materials || [];
  const dimensionOptions = filtersData?.data?.dimensions || [];
  const availableTags = filtersData?.data?.tags || [];

  return (
    <>
      {/* Header Section with Search */}
      <SearchHeader
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={() => setPage(1)}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
        limit={limit}
        onLimitChange={handleLimitChange}
        showFilters={showFilters}
        onOpenChange={handleOpenSheet}
        activeFiltersCount={activeFiltersCount}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        toggleTempTag={toggleTempTag}
        categories={categories}
        materials={materials}
        dimensionOptions={dimensionOptions}
        availableTags={availableTags}
      />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-[1800px]">
        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          activeFiltersCount={activeFiltersCount}
          onRemoveFilter={handleRemoveFilter}
          onRemoveTag={handleRemoveTag}
          onClearAll={handleClearFilters}
        />

        {/* Content */}
        {isLoading || isFetching ? (
          <GridLoadingSkeleton count={limit} />
        ) : error ? (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {"data" in error &&
              error.data &&
              typeof error.data === "object" &&
              "message" in error.data
                ? (error.data as { message: string }).message
                : "Failed to load posters. Please try again later."}
            </AlertDescription>
          </Alert>
        ) : posters.length === 0 ? (
          <EmptyState
            title="No posters found"
            description="We couldn't find any posters matching your criteria. Try adjusting your filters."
            actionLabel="Clear All Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <>
            <PostersGrid posters={posters} />
            <SmartPagination
              currentPage={page}
              totalPages={totalPages}
              hasPrev={pagination?.hasPrev}
              hasNext={pagination?.hasNext}
              totalItems={pagination?.total}
              itemLabel="posters"
              onPageChange={setPage}
              className="mt-6 sm:mt-8"
            />
          </>
        )}
      </div>
    </>
  );
}

export default function PostersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<GridLoadingSkeleton count={12} />}>
        <PostersContent />
      </Suspense>
    </main>
  );
}
