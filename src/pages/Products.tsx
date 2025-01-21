import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import { ProductCard } from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 12;

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showStart = Math.max(0, currentPage - 2);
  const showEnd = Math.min(totalPages, currentPage + 3);
  const visiblePages = pages.slice(showStart, showEnd);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showStart > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="hover:bg-gray-100"
          >
            1
          </Button>
          {showStart > 1 && <span className="text-gray-500">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={currentPage !== page ? "hover:bg-gray-100" : ""}
        >
          {page}
        </Button>
      ))}

      {showEnd < totalPages && (
        <>
          {showEnd < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="hover:bg-gray-100"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const FilterSheet = ({
  selectedType,
  setSelectedType,
  selectedBrand,
  setSelectedBrand,
  sortBy,
  setSortBy,
  brands,
  onClose,
}) => (
  <SheetContent className="w-full sm:max-w-md">
    <SheetHeader>
      <SheetTitle>Filter Products</SheetTitle>
    </SheetHeader>
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Product Type</h3>
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
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
        <Select
          value={selectedBrand}
          onValueChange={(value) => setSelectedBrand(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      <Button onClick={onClose} className="w-full">
        Apply Filters
      </Button>
    </SheetFooter>
  </SheetContent>
);

const ProductFilters = ({
  selectedType,
  setSelectedType,
  selectedBrand,
  setSelectedBrand,
  sortBy,
  setSortBy,
  brands,
  view,
  setView,
  isInfiniteScroll,
  setIsInfiniteScroll,
}) => (
  <div className="hidden md:flex items-center gap-4">
    <div className="flex gap-2">
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[180px]">
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

      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest Arrivals</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="ml-auto flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Infinite scroll</span>
        <Switch
          checked={isInfiniteScroll}
          onCheckedChange={setIsInfiniteScroll}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setView("grid")}
          className={view !== "grid" ? "hover:bg-gray-100" : ""}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setView("list")}
          className={view !== "list" ? "hover:bg-gray-100" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("grid");
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [loadedItems, setLoadedItems] = useState(ITEMS_PER_PAGE);

  const { ref: loadMoreRef, inView } = useInView();

  // Add connection check
  useEffect(() => {
    checkSupabaseConnection().then((isConnected) => {
      if (!isConnected) {
        toast.error("Failed to connect to the database. Please try again later.");
      }
    });
  }, []);

  const {
    data: allProducts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchQuery, selectedType, selectedBrand, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from("products")
          .select("id, name, brand, image_url, online_price, category")
          .not("image_url", "is", null);

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }
        if (selectedType !== "all") {
          query = query.eq("category", selectedType);
        }
        if (selectedBrand !== "all") {
          query = query.eq("brand", selectedBrand);
        }
        if (sortBy === "price_asc") {
          query = query.order("online_price", { ascending: true });
        } else if (sortBy === "price_desc") {
          query = query.order("online_price", { ascending: false });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Supabase query error:", error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error("Failed to fetch products:", err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null)
        .not("image_url", "is", null);

      if (error) throw error;
      return [...new Set(data.map((item) => item.brand))]
        .filter(Boolean)
        .sort();
    },
  });

  // Effect for infinite scroll
  useEffect(() => {
    if (inView && isInfiniteScroll && loadedItems < allProducts.length) {
      setLoadedItems((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allProducts.length),
      );
    }
  }, [inView, isInfiniteScroll, allProducts.length]);

  // Reset loaded items when filters change
  useEffect(() => {
    setLoadedItems(ITEMS_PER_PAGE);
  }, [searchQuery, selectedType, selectedBrand, sortBy]);

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = isInfiniteScroll
    ? allProducts.slice(0, loadedItems)
    : allProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
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

              <Sheet
                open={isFilterSheetOpen}
                onOpenChange={setIsFilterSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <FilterSheet
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  brands={brands}
                  onClose={() => setIsFilterSheetOpen(false)}
                />
              </Sheet>
            </div>

            <ProductFilters
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              sortBy={sortBy}
              setSortBy={setSortBy}
              brands={brands}
              view={view}
              setView={setView}
              isInfiniteScroll={isInfiniteScroll}
              setIsInfiniteScroll={setIsInfiniteScroll}
            />
          </div>

          {/* Products Display */}
          {isLoading ? (
            <div
              className={cn(
                "grid gap-6",
                view === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1",
              )}
            >
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-500">Failed to load products</p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your connection and try again
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : allProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found</p>
              {(searchQuery ||
                selectedType !== "all" ||
                selectedBrand !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("all");
                    setSelectedBrand("all");
                    setSortBy("latest");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-6",
                  view === "grid"
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1",
                )}
              >
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "transform transition-all duration-300",
                      "hover:translate-y-[-4px]",
                      "focus-within:translate-y-[-4px]",
                      view === "list" && "max-w-3xl mx-auto w-full",
                    )}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Loader */}
              {isInfiniteScroll && loadedItems < allProducts.length && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-8"
                >
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}

              {/* Pagination Controls */}
              {!isInfiniteScroll && totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
