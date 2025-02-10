import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function RecentProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["recentProducts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, image_url, online_price, category")
        .not("image_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading products...</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Latest Products
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Check out our newest arrivals
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Link to="/products" className="inline-flex items-center gap-2">
              See All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
