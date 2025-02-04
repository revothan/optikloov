import { Suspense, lazy, useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ProductDialog } from "@/components/ProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/LogoutButton";
import InvoiceList from "@/components/InvoiceList";
import { InvoiceDialog } from "@/components/InvoiceDialog";
import { SalesReport } from "@/components/SalesReport";
import { cn } from "@/lib/utils";
import {
  Package,
  FileText,
  Users,
  ClipboardList,
  BarChart3,
  Glasses,
  Menu,
  Search,
  Loader2,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
import { LensStockMatrix } from "@/components/lens-stock/LensStockMatrix";
import { JobOrderList } from "@/components/JobOrderList";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load components
const CustomerTable = lazy(() => import("@/components/CustomerList"));

const MENU_ITEMS = [
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "job-orders", label: "Job Orders", icon: ClipboardList },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "lens-stock", label: "Lens Stock", icon: Glasses },
];

export default function Admin() {
  const session = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("invoices");
  const isMobile = useIsMobile();

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: "exact" });

      if (error) throw error;
      return { data, count };
    },
  });

  // Get user's name from session
  const userName = session?.user?.email?.split("@")[0] || "User";

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

  const filteredProducts =
    productsData?.data?.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const totalValue =
    productsData?.data?.reduce(
      (sum, product) => sum + (product.store_price || 0),
      0,
    ) || 0;

  if (productsError) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500">Error loading products</p>
        <Button onClick={() => refetch}>Retry</Button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <ProductDialog />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsLoading
                ? Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-[200px] w-full" />
                    ))
                : filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDeleteProduct}
                    />
                  ))}
            </div>
          </div>
        );
      case "customers":
        return (
          <Suspense fallback={<div>Loading customers...</div>}>
            <CustomerTable />
          </Suspense>
        );
      case "invoices":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Invoices</h2>
              <InvoiceDialog />
            </div>
            <InvoiceList />
          </div>
        );
      case "job-orders":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Job Orders</h2>
            <JobOrderList />
          </div>
        );
      case "sales":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Sales Report</h2>
            <SalesReport />
          </div>
        );
      case "lens-stock":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Lens Stock Management</h2>
            <LensStockMatrix />
          </div>
        );
      default:
        return null;
    }
  };

  // Stats Cards
  const StatsCards = () => (
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "border-r bg-white",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "hidden",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo/Brand */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
              {!isCollapsed && <h1 className="text-xl font-bold">Admin</h1>}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1 p-2">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-4",
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon
                      className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t p-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
          <nav className="flex justify-around p-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "flex flex-col items-center justify-center",
                    activeTab === item.id && "text-primary",
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out",
          "min-h-screen bg-gray-50",
          isMobile
            ? "pb-20 px-4" // Add padding for mobile bottom nav
            : isCollapsed
              ? "pl-16" // Collapsed sidebar width
              : "pl-64", // Full sidebar width
        )}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Hello, {userName}! Welcome back 👋
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Area */}
          <ErrorBoundary>
            <div className="bg-white rounded-lg shadow p-6">
              {renderContent()}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
