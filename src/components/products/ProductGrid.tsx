import React from "react";
import { ProductCard } from "../ProductCard";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
