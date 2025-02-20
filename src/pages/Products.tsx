import type { Tables } from "@/integrations/supabase/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Product = Tables<"products">;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", currentPage, category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
    setCurrentPage(1); // Reset to the first page when the category changes
  };

  const productsPerPage = 12;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Category Filters */}
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            category === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange(null)}
        >
          All
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            category === "Frame"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange("Frame")}
        >
          Frame
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            category === "Lens"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange("Lens")}
        >
          Lens
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            category === "Contact Lens"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange("Contact Lens")}
        >
          Contact Lens
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${
            category === "Accessories"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleCategoryChange("Accessories")}
        >
          Accessories
        </button>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <p>Loading...</p>
      ) : products ? (
        <ProductGrid products={products} />
      ) : (
        <p>No products found.</p>
      )}

      {/* Pagination */}
      {products && products.length > 0 && (
        <div className="flex justify-center mt-8">
          {Array.from(
            { length: Math.ceil(products.length / productsPerPage) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
