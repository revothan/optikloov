import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  store_price: number;
  category: string;
}

interface LensStock {
  id: string;
  sph: number;
  cyl: number;
  quantity: number;
  lens_type_id: string;
  lens_type: {
    name: string;
    material: string;
    price?: number;
  };
}

interface ProductSelectProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
}

const CATEGORIES = ["Frame", "Lensa", "Soft Lens", "Sunglasses", "Others"];

const formatNumber = (num: number) => {
  const fixed = num.toFixed(2);
  return num > 0 ? `+${fixed}` : fixed;
};

export function ProductSelect({
  value,
  onChange,
  onProductSelect,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductCategory, setCustomProductCategory] = useState("Others");
  const [selectedCustomName, setSelectedCustomName] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, store_price, category");

      if (error) throw error;
      return data || [];
    },
  });

  const {
    data: lensStock = [],
    isLoading: isLoadingLensStock,
  } = useQuery({
    queryKey: ["lens-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lens_stock")
        .select(`
          id,
          sph,
          cyl,
          quantity,
          lens_type:lens_type_id (
            name,
            material
          )
        `)
        .gt('quantity', 0);

      if (error) throw error;
      return data || [];
    },
  });

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const filteredLensStock = useMemo(() => {
    if (!Array.isArray(lensStock)) return [];
    
    return lensStock.filter((stock) => {
      const searchString = `${stock.lens_type?.name} ${stock.lens_type?.material} SPH:${formatNumber(stock.sph)} CYL:${formatNumber(stock.cyl)}`.toLowerCase();
      return searchString.includes(searchQuery.toLowerCase());
    });
  }, [lensStock, searchQuery]);

  const selectedProduct = useMemo(() => {
    if (!Array.isArray(products)) return undefined;
    return products.find((product) => product.id === value);
  }, [products, value]);

  const handleProductSelect = (product: Product) => {
    onChange(product.id);
    onProductSelect(product);
    setOpen(false);
    setSearchQuery("");
    if (product.id.includes('-')) {
      setSelectedCustomName(product.name);
    }
  };

  const handleLensStockSelect = async (stock: LensStock) => {
    try {
      if (!stock.lens_type_id) {
        toast.error("Invalid lens type selection");
        return;
      }

      // Get the lens type details including price
      const { data: lensType, error: lensTypeError } = await supabase
        .from('lens_types')
        .select('*')
        .eq('id', stock.lens_type_id)
        .maybeSingle();

      if (lensTypeError) throw lensTypeError;
      if (!lensType) {
        toast.error("Lens type not found");
        return;
      }

      // Create a product from the lens stock
      const productName = `${stock.lens_type?.name} ${stock.lens_type?.material} SPH:${formatNumber(stock.sph)} CYL:${formatNumber(stock.cyl)}`;
      const customProductId = generateUUID();
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user?.id) {
        toast.error("User not authenticated");
        return;
      }

      const { error: insertError } = await supabase.from("products").insert({
        id: customProductId,
        name: productName,
        store_price: lensType.price || 0,
        category: "Stock Lens",
        user_id: userData.user.id,
      });

      if (insertError) throw insertError;

      const product = {
        id: customProductId,
        name: productName,
        store_price: lensType.price || 0,
        category: "Stock Lens",
      };

      handleProductSelect(product);
      toast.success("Lens stock selected successfully");
    } catch (error) {
      console.error("Error selecting lens stock:", error);
      toast.error("Failed to select lens stock");
    }
  };

  const handleCustomProductSubmit = async () => {
    if (customProductName.trim()) {
      try {
        const customProductId = generateUUID();
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user?.id) {
          toast.error("User not authenticated");
          return;
        }

        const { error: insertError } = await supabase.from("products").insert({
          id: customProductId,
          name: customProductName,
          store_price: 0,
          category: customProductCategory,
          user_id: userData.user.id,
        });

        if (insertError) throw insertError;

        const customProduct = {
          id: customProductId,
          name: customProductName,
          store_price: 0,
          category: customProductCategory,
        };

        await refetch();
        handleProductSelect(customProduct);
        setCustomProductName("");
        setCustomProductCategory("Others");
        setIsCustomProduct(false);
        setOpen(false);
        toast.success("Custom product created successfully");
      } catch (error) {
        console.error("Error creating custom product:", error);
        toast.error("Failed to create custom product");
      }
    }
  };

  const getDisplayName = () => {
    if (isLoadingProducts) return "Loading...";
    if (value?.includes('-')) return selectedCustomName;
    return selectedProduct?.name || "Select product...";
  };

  if (isProductsError) {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>Product</FormLabel>
        <Button
          variant="outline"
          className="w-full justify-between text-destructive"
          type="button"
        >
          Error loading products
        </Button>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Product</FormLabel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between bg-background",
                !value && "text-muted-foreground"
              )}
              disabled={isLoadingProducts}
              type="button"
            >
              {isLoadingProducts ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                getDisplayName()
              )}
            </Button>
          </FormControl>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Product</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isCustomProduct}
                  onCheckedChange={setIsCustomProduct}
                />
                <span className="text-sm">Custom Product</span>
              </div>
            </div>

            {isCustomProduct ? (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    placeholder="Enter custom product name..."
                    value={customProductName}
                    onChange={(e) => setCustomProductName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomProductSubmit();
                      }
                    }}
                  />
                  <Select
                    value={customProductCategory}
                    onValueChange={setCustomProductCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={handleCustomProductSubmit}
                  disabled={!customProductName.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Product
                </Button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="lens-stock">Lens Stock</TabsTrigger>
                </TabsList>

                <div className="flex items-center space-x-2 sticky top-0 bg-background p-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={activeTab === "products" ? "Search products..." : "Search lens stock..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <TabsContent value="products">
                  <ScrollArea className="h-[50vh]">
                    {filteredProducts.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No products found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredProducts.map((product) => (
                          <Button
                            key={product.id}
                            type="button"
                            variant="ghost"
                            className={cn(
                              "justify-start font-normal py-6 px-4 hover:bg-accent hover:text-accent-foreground",
                              value === product.id && "bg-accent"
                            )}
                            onClick={() => handleProductSelect(product)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === product.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-sm text-muted-foreground">
                                Category: {product.category}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="lens-stock">
                  <ScrollArea className="h-[50vh]">
                    {isLoadingLensStock ? (
                      <div className="py-6 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Loading lens stock...</p>
                      </div>
                    ) : filteredLensStock.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        No lens stock found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredLensStock.map((stock) => (
                          <Button
                            key={stock.id}
                            type="button"
                            variant="ghost"
                            className="justify-start font-normal py-6 px-4 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleLensStockSelect(stock)}
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {stock.lens_type?.name} {stock.lens_type?.material}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                SPH: {formatNumber(stock.sph)} | CYL: {formatNumber(stock.cyl)} | Stock: {stock.quantity}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </FormItem>
  );
}