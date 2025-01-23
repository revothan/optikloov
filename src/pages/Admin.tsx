import { Suspense, lazy, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductDialog } from "@/components/ProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
  Package,
  DollarSign,
  Users,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceDialog } from "@/components/InvoiceDialog";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";

// Lazy load components
const CustomerTable = lazy(() => import("@/components/CustomerList"));
const InvoiceList = lazy(() => import("@/components/InvoiceList"));

const ITEMS_PER_PAGE = 12;

export default function Admin() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Prefetch next page
  const prefetchNextPage = async (page: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["products", page + 1],
      queryFn: () => fetchProducts(page + 1),
    });
  };

  // Optimized product fetching with pagination
  const fetchProducts = async (page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;
    return { data, count };
  };

  // Fetch products with pagination
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", currentPage],
    queryFn: () => fetchProducts(currentPage),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Prefetch next page when current page is loaded
  useEffect(() => {
    if (productsData?.count && currentPage * ITEMS_PER_PAGE < productsData.count) {
      prefetchNextPage(currentPage);
    }
  }, [currentPage, productsData]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Filter products based on search query
  const filteredProducts = productsData?.data?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Calculate statistics
  const totalProducts = productsData?.count || 0;
  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + (product.store_price || 0),
    0
  );

  if (productsError) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500">Error loading products</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={Package}
          title="Total Products"
          value={totalProducts}
          description="Active products in inventory"
          loading={productsLoading}
        />
        <StatsCard
          icon={DollarSign}
          title="Total Inventory Value"
          value={formatPrice(totalValue)}
          description="Based on store prices"
          loading={productsLoading}
        />
      </div>

      <ErrorBoundary>
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <SearchBar onSearch={setSearchQuery} />
                  <ProductDialog />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDeleteProduct}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
              {productsData?.count > ITEMS_PER_PAGE && (
                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={
                      currentPage * ITEMS_PER_PAGE >= (productsData?.count || 0)
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="customers">
            <Suspense fallback={<div>Loading customers...</div>}>
              <CustomerTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="invoices">
            <Suspense fallback={<div>Loading invoices...</div>}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Invoices</h2>
                  <InvoiceDialog />
                </div>
                <InvoiceList />
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
    </div>
  );
}

// Optimized StatsCard component with loading state
const StatsCard = ({
  icon: Icon,
  title,
  value,
  description,
  loading = false,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-7 w-24" />
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </>
      )}
    </CardContent>
  </Card>
);

// Optimized SearchBar component
const SearchBar = ({ onSearch }) => (
  <div className="relative w-full max-w-sm">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      placeholder="Search products..."
      className="pl-10"
      onChange={(e) => onSearch(e.target.value)}
    />
  </div>
);
