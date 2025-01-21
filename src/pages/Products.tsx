import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ViewToggle } from "@/components/products/ViewToggle";
import { Pagination } from "@/components/products/Pagination";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const {
    data: allProducts = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchQuery, selectedType, selectedBrand, selectedCategory, sortBy],
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

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = allProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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