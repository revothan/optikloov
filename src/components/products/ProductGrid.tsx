import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

type MinimalProduct = Pick<Tables<"products">, "id" | "name" | "brand" | "image_url" | "online_price" | "category">;

interface ProductGridProps {
  products: MinimalProduct[];
  isLoading: boolean;
  error: Error | null;
  view: "grid" | "list";
  refetch: () => void;
}

export function ProductGrid({ products, isLoading, error, view, refetch }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">Failed to load products</p>
        <p className="text-sm text-gray-500 mt-2">
          Please check your connection and try again
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        view === "grid"
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-1"
      )}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "transform transition-all duration-300",
            "hover:translate-y-[-4px]",
            "focus-within:translate-y-[-4px]",
            view === "list" && "max-w-3xl mx-auto w-full"
          )}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}