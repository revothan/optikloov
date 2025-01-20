import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

interface Product {
  id: string;
  name: string;
  store_price: number;
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

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, store_price");

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const selectedProduct = products.find((product) => product.id === value);

  if (isError) {
    return (
      <FormItem className="flex flex-col">
        <FormLabel>Product</FormLabel>
        <Button
          variant="outline"
          className="w-full justify-between text-destructive"
        >
          Error loading products
        </Button>
      </FormItem>
    );
  }

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Product</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                !value && "text-muted-foreground",
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  {selectedProduct ? selectedProduct.name : "Select product..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex flex-col">
            <div className="flex items-center border-b p-2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0"
              />
            </div>
            <ScrollArea className="h-[200px]">
              {filteredProducts.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No products found.
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredProducts.map((product) => (
                    <Button
                      key={product.id}
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => {
                        onChange(product.id);
                        onProductSelect(product);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === product.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {product.name}
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}

