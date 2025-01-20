import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProductSelect } from "./invoice/ProductSelect";
import { CommonFields } from "./invoice/CommonFields";
import { PrescriptionFields } from "./invoice/PrescriptionFields";
import { ItemDetails } from "./invoice/ItemDetails";

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
  const calculateItemTotal = (index: number) => {
    const quantity = parseFloat(form.watch(`items.${index}.quantity`) || "0");
    const price = parseFloat(form.watch(`items.${index}.price`) || "0");
    const discount = parseFloat(form.watch(`items.${index}.discount`) || "0");
    return (quantity * price) - discount;
  };

  const handleProductSelect = (productId: string, index: number) => {
    const product = form.getValues(`items.${index}.product_id`);
    if (product) {
      form.setValue(`items.${index}.price`, product.store_price || 0);
      form.setValue(`items.${index}.product_id`, product.id);
      form.setValue(`items.${index}.left_eye`, null);
      form.setValue(`items.${index}.right_eye`, null);
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

          <ProductSelect
            value={form.watch(`items.${index}.product_id`)}
            onChange={(value) => form.setValue(`items.${index}.product_id`, value)}
            onProductSelect={(productId) => handleProductSelect(productId, index)}
          />

          <ItemDetails
            form={form}
            index={index}
            calculateItemTotal={calculateItemTotal}
          />

          <div className="col-span-full">
            <h4 className="font-medium mb-2">Prescription Details</h4>
            
            <CommonFields form={form} index={index} />
            
            <div className="space-y-4">
              <PrescriptionFields form={form} index={index} side="left" />
              <PrescriptionFields form={form} index={index} side="right" />
            </div>
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