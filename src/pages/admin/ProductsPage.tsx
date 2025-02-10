
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductDialog } from "@/components/ProductDialog";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Pagination } from "@/components/products/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

const getBranchName = (branchCode: string | null) => {
  switch (branchCode) {
    case 'GS':
      return 'Gading Serpong';
    case 'KD':
      return 'Kelapa Dua';
    default:
      return null;
  }
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get user profile to determine branch
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("branch")
        .eq("id", user.id)
        .single();

      return profile;
    },
  });

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", debouncedSearch, currentPage, userProfile?.branch],
    queryFn: async () => {
      try {
        const branchName = getBranchName(userProfile?.branch);
        let query = supabase
          .from("products")
          .select("*", { count: "exact" });

        if (branchName) {
          query = query.eq("branch", branchName);
        }

        if (debouncedSearch) {
          query = query.ilike("name", `%${debouncedSearch}%`);
        }

        // Calculate offset based on current page
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        
        const { data, error, count } = await query
          .order("created_at", { ascending: false })
          .range(offset, offset + ITEMS_PER_PAGE - 1);

        if (error) throw error;
        return { data, count };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: !!userProfile,
  });

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = productsData?.data || [];
  const totalPages = Math.ceil((productsData?.count || 0) / ITEMS_PER_PAGE);

  const totalValue =
    productsData?.data?.reduce(
      (sum, product) => sum + (product.store_price || 0),
      0,
    ) || 0;

  return (
    <div className="p-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="text-2xl font-bold">{productsData?.count || 0}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inventory Value
                </p>
                <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <ProductDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {!isLoading && !error && totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
