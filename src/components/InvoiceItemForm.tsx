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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { formatPrice } from "@/lib/utils";

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
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
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
    }
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
              eye_side: "",
              sph: 0,
              cyl: 0,
              axis: 0,
              add_power: 0,
              pd: 0,
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
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => handleProductSelect(value, index)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productsLoading ? (
                      <div className="p-2 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`items.${index}.eye_side`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eye Side</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        // Only set the value if it's one of the valid options
                        if (value === "left" || value === "right") {
                          field.onChange(value);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select side" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.sph`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPH</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.cyl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CYL</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.axis`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AXIS</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.add_power`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ADD</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`items.${index}.pd`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PD</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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