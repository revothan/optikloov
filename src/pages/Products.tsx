import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(0);
  const { ref: loadMoreRef, inView } = useInView();

  // Fetch products with optimized query
  const {
    data: products = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", searchQuery, selectedType, selectedBrand, sortBy, page],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("id, name, brand, image_url, online_price, category")
        .not("image_url", "is", null)
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

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

      if (error) throw error;
      return data || [];
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch unique brands with optimized query
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("brand")
        .not("brand", "is", null)
        .not("image_url", "is", null);

      if (error) throw error;

      const uniqueBrands = [...new Set(data.map((item) => item.brand))].filter(
        Boolean,
      );
      return uniqueBrands.sort();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (inView && !isLoading && !isFetching && products.length === ITEMS_PER_PAGE) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isLoading, isFetching, products.length]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedType, selectedBrand, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Type</label>
                    <Select
                      value={selectedType}
                      onValueChange={(value) => {
                        setSelectedType(value);
                        setPage(0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Frame">Frame</SelectItem>
                        <SelectItem value="Lensa">Lensa</SelectItem>
                        <SelectItem value="Soft Lens">Soft Lens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Brand</label>
                    <Select
                      value={selectedBrand}
                      onValueChange={(value) => {
                        setSelectedBrand(value);
                        setPage(0);
                      }}
                    >
                      <SelectTrigger>
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
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={sortBy}
                      onValueChange={(value) => {
                        setSortBy(value);
                        setPage(0);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="price_asc">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price_desc">
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex gap-4">
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value);
                setPage(0);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Frame">Frame</SelectItem>
                  <SelectItem value="Lensa">Lensa</SelectItem>
                  <SelectItem value="Soft Lens">Soft Lens</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBrand} onValueChange={(value) => {
                setSelectedBrand(value);
                setPage(0);
              }}>
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

              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setPage(0);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading && page === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Loading More Indicator */}
              {(isFetching || products.length === ITEMS_PER_PAGE) && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-8"
                >
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}