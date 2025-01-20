import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductDialog } from "@/components/ProductDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Package,
  DollarSign,
  Users,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import LogoutButton from "@/components/LogoutButton";
import { CustomerTable } from "@/components/CustomerList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceDialog } from "@/components/InvoiceDialog";
import { InvoiceList } from "@/components/InvoiceList";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductCard = ({ product, onDelete }) => {
  const hasLowStock =
    product.track_inventory &&
    (product.stock_qty || 0) <= (product.low_stock_alert || 0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative">
        {/* Image Section */}
        {product.image_url ? (
          <div className="aspect-square bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Action buttons - Always visible on top right */}
        <div className="absolute top-2 right-2 flex gap-2">
          <ProductDialog
            mode="edit"
            product={product}
            trigger={
              <Button
                variant="secondary"
                size="sm"
                className="bg-white hover:bg-gray-100 shadow-sm"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
        </div>

        {/* Low stock indicator - Made more subtle */}
        {hasLowStock && (
          <div className="absolute top-2 left-2">
            <div className="bg-white/90 backdrop-blur-sm text-red-600 text-xs px-2 py-1 rounded-md shadow-sm">
              Low Stock: {product.stock_qty}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-3 line-clamp-2">
          {product.name}
        </h3>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-muted-foreground">Store Price</div>
          <div className="text-right font-medium">
            {formatPrice(product.store_price || 0)}
          </div>

          <div className="text-muted-foreground">Sell Price</div>
          <div className="text-right font-medium">
            {formatPrice(product.sell_price || 0)}
          </div>

          <div className="text-muted-foreground">Online Price</div>
          <div className="text-right font-medium">
            {formatPrice(product.online_price || 0)}
          </div>

          {product.track_inventory && (
            <>
              <div className="text-muted-foreground">Stock Level</div>
              <div className="text-right">
                <span
                  className={`font-medium ${
                    hasLowStock ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {product.stock_qty || 0}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Delete button moved to bottom */}
        <div className="mt-4 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

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

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user profile to check role
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch customers data
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*");

      if (error) throw error;
      return data;
    },
  });

  // Fetch products with automatic background updates
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate statistics
  const totalProducts = products?.length || 0;
  const totalValue =
    products?.reduce((sum, product) => sum + (product.store_price || 0), 0) ||
    0;
  const lowStockProducts =
    products?.filter(
      (product) =>
        product.track_inventory &&
        (product.stock_qty || 0) <= (product.low_stock_alert || 0),
    ).length || 0;
  const totalCustomers = customers?.length || 0;

  useEffect(() => {
    if (!session) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!profileLoading && profile !== undefined) {
      if (profile?.role !== "admin") {
        navigate("/");
      }
    }
  }, [session, profile, navigate, profileLoading, location]);

  if (profileLoading || productsLoading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
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
        />
        <StatsCard
          icon={DollarSign}
          title="Total Inventory Value"
          value={formatPrice(totalValue)}
          description="Based on store prices"
        />
        <StatsCard
          icon={Users}
          title="Total Customers"
          value={totalCustomers}
          description="Registered customers"
        />
      </div>

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
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <CustomerTable />
        </TabsContent>

        <TabsContent value="invoices">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Invoices</h2>
              <InvoiceDialog />
            </div>
            <InvoiceList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default Admin;
