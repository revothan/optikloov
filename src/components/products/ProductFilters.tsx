import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
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
  sortBy,
  setSortBy,
  brands,
  isFilterSheetOpen,
  setIsFilterSheetOpen,
}: ProductFiltersProps) {
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Product Type</h3>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                    <SelectItem value="Eyeglasses">Eyeglasses</SelectItem>
                    <SelectItem value="Contact Lenses">Contact Lenses</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Brand</h3>
                <div className="space-y-2">
                  <Input
                    placeholder="Search brands..."
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-full">
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
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
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
            <SheetFooter>
              <Button onClick={() => setIsFilterSheetOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}