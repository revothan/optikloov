import { SearchInput } from "./SearchInput";
import { CategoryFilter } from "./CategoryFilter";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  brands: string[];
  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (value: boolean) => void;
}

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ProductFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
}