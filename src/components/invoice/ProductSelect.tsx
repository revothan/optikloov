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

interface Product {
  id: string;
  name: string;
  store_price: number;
  category: string;
}

interface ProductSelectProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
}

export function ProductSelect({
  value,
  onChange,
  onProductSelect,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomProduct, setIsCustomProduct] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [selectedCustomName, setSelectedCustomName] = useState("");

  const {
    data: products = [],
    isLoading,
    isError,
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

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const selectedProduct = useMemo(() => {
    if (!Array.isArray(products)) return undefined;
    return products.find((product) => product.id === value);
  }, [products, value]);

  const handleProductSelect = (product: Product) => {
    onChange(product.id);
    onProductSelect(product);
    setOpen(false);
    setSearchQuery("");
    if (product.id.startsWith('custom-')) {
      setSelectedCustomName(product.name);
    }
  };

  const handleCustomProductSubmit = () => {
    if (customProductName.trim()) {
      const customProduct = {
        id: `custom-${Date.now()}`,
        name: customProductName,
        store_price: 0,
        category: "Custom",
      };
      handleProductSelect(customProduct);
      setCustomProductName("");
      setIsCustomProduct(false);
      setOpen(false);
    }
  };

  const getDisplayName = () => {
    if (isLoading) return "Loading...";
    if (value?.startsWith("custom-")) return selectedCustomName;
    return selectedProduct?.name || "Select product...";
  };

  if (isError) {
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
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
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
              <div className="flex items-center space-x-2">
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
                <Button
                  type="button"
                  onClick={handleCustomProductSubmit}
                  disabled={!customProductName.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2 sticky top-0 bg-background p-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <FormMessage />
    </FormItem>
  );
}