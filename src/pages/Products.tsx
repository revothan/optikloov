import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ViewToggle } from "@/components/products/ViewToggle";
import { Pagination } from "@/components/products/Pagination";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Debounce the search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory]);

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", debouncedSearch, selectedType, selectedBrand, selectedCategory, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from("products")
          .select("id, name, brand, image_url, online_price, category")
          .not("image_url", "is", null);

        if (debouncedSearch) {
          query = query.ilike("name", `%${debouncedSearch}%`);
        }
        if (selectedType !== "all") {
          query = query.eq("category", selectedType);
        }
        if (selectedBrand !== "all") {
          query = query.ilike("brand", selectedBrand);
        }
        if (selectedCategory !== "all") {
          query = query.eq("category", selectedCategory);
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

  // Calculate pagination
  const totalProducts = productsData?.length || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = productsData?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProductFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            brands={brands}
            isFilterSheetOpen={isFilterSheetOpen}
            setIsFilterSheetOpen={setIsFilterSheetOpen}
          />

          <div className="mb-6 flex justify-end">
            <ViewToggle view={view} setView={setView} />
          </div>

          <ProductGrid
            products={displayedProducts}
            isLoading={isLoading}
            error={error}
            view={view}
            refetch={refetch}
          />

          {!isLoading && !error && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}