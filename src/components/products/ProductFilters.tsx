import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
  selectedType,
  setSelectedType,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  brands,
}: ProductFiltersProps) {
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <div className="hidden md:flex flex-col md:flex-row gap-4">
          <div className="space-y-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                <SelectItem value="Eyeglasses">Eyeglasses</SelectItem>
                <SelectItem value="Soft Lens">Soft Lens</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  <SelectItem value="all">All Brands</SelectItem>
                  {filteredBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}