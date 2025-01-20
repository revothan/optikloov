import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface InvoiceItemFormProps {
  form: UseFormReturn<any>;
  itemFields: {
    fields: any[];
    append: (...items: any[]) => void;
    prepend: (...items: any[]) => void;
    remove: (index: number) => void;
    swap: (indexA: number, indexB: number) => void;
    move: (from: number, to: number) => void;
    insert: (index: number, value: any) => void;
  };
}

export function InvoiceItemForm({ form, itemFields }: InvoiceItemFormProps) {
  const [open, setOpen] = useState<number | null>(null);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data || []; // Ensure we always return an array
    },
  });

  const calculateItemTotal = (index: number) => {
    const quantity = parseFloat(form.watch(`items.${index}.quantity`) || "0");
    const price = parseFloat(form.watch(`items.${index}.price`) || "0");
    const discount = parseFloat(form.watch(`items.${index}.discount`) || "0");
    return (quantity * price) - discount;
  };

  const handleProductSelect = (productId: string, index: number) => {
    const product = products?.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.price`, product.store_price || 0);
      form.setValue(`items.${index}.product_id`, product.id);
      // Reset prescription fields when product changes
      form.setValue(`items.${index}.left_eye`, null);
      form.setValue(`items.${index}.right_eye`, null);
    }
    setOpen(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            itemFields.append({
              product_id: "",
              quantity: 1,
              price: 0,
              discount: 0,
              pd: null,
              sh: null,
              v_frame: null,
              f_size: null,
              prism: null,
              left_eye: null,
              right_eye: null,
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {itemFields.fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg relative"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-destructive"
            onClick={() => itemFields.remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <FormField
            control={form.control}
            name={`items.${index}.product_id`}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Product</FormLabel>
                <Popover 
                  open={open === index} 
                  onOpenChange={(isOpen) => setOpen(isOpen ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? products?.find((product) => product.id === field.value)
                              ?.name
                          : "Select product"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search products..." />
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {productsLoading ? (
                          <div className="p-2 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : products && products.length > 0 ? (
                          products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.name}
                              onSelect={() => handleProductSelect(product.id, index)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  product.id === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {product.name}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No products found.</CommandEmpty>
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("items");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">Rp</span>
                    <Input
                      type="number"
                      className="pl-12"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("items");
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.discount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">Rp</span>
                    <Input
                      type="number"
                      className="pl-12"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("items");
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full">
            <h4 className="font-medium mb-2">Prescription Details</h4>
            
            {/* Common Fields */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <FormField
                control={form.control}
                name={`items.${index}.pd`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PD</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.5" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.sh`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SH</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.25" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.prism`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PRISM</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.25" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.v_frame`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>V FRAME</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.f_size`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>F SIZE</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Left Eye */}
            <div className="mb-4">
              <h5 className="text-sm font-medium mb-2">Left Eye</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.left_eye.sph`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPH</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.left_eye.cyl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CYL</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.left_eye.axis`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AXIS</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.left_eye.add_power`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ADD</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Eye */}
            <div>
              <h5 className="text-sm font-medium mb-2">Right Eye</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.right_eye.sph`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SPH</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.right_eye.cyl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CYL</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.right_eye.axis`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AXIS</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.right_eye.add_power`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ADD</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.25" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="col-span-full text-right text-sm text-muted-foreground">
            Total: {formatPrice(calculateItemTotal(index))}
          </div>
        </div>
      ))}

      {itemFields.fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No items added yet
        </div>
      )}
    </div>
  );
}