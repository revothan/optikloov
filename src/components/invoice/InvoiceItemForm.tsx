
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { ProductSelect } from "@/components/invoice/ProductSelect";
import type { InvoiceFormValues } from "./invoiceFormSchema";

interface InvoiceItemFormProps {
  index: number;
  handleProductSelect: (product: any) => void;
}

export function InvoiceItemForm({
  index,
  handleProductSelect,
}: InvoiceItemFormProps) {
  const { control, watch } = useFormContext<InvoiceFormValues>();
  const branch = watch("branch"); // Get branch from form context

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`items.${index}.product_id`}
        render={({ field }) => (
          <ProductSelect
            value={field.value}
            onChange={field.onChange}
            onProductSelect={handleProductSelect}
            branch={branch}
          />
        )}
      />
    </div>
  );
}
