export interface FilterState {
  search: string;
  category: string;
  material: string;
  dimensions: string;
  isAvailable?: boolean;
  minPrice: string;
  maxPrice: string;
  minStock: string;
  maxStock: string;
  selectedTags: string[];
}
