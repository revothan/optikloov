import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { supabase } from "@/integrations/supabase/client";

interface ProductSelectProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect: (productId: string) => void;
}

export function ProductSelect({ value, onChange, onProductSelect }: ProductSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand")
        .order("name");
      
      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }
      return data || [];
    },
  });

  const selectedProduct = products.find((product) => product.id === value);

  const handleSelect = (currentValue: string) => {
    if (!currentValue) return;
    
    const product = products.find(
      (p) => p.name.toLowerCase() === currentValue.toLowerCase()
    );
    
    if (product) {
      onChange(product.id);
      onProductSelect(product.id);
      setOpen(false);
    }
  };

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
                !value && "text-muted-foreground"
              )}
            >
              {selectedProduct ? selectedProduct.name : "Select product..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search products..." />
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === product.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>{product.name}</span>
                    </div>
                    {product.brand && (
                      <span className="text-sm text-muted-foreground">
                        {product.brand}
                      </span>
                    )}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}