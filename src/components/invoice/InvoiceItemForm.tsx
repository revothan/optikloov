import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { ProductSelect } from "@/components/invoice/ProductSelect";
import type { InvoiceFormValues } from "./invoiceFormSchema";

interface InvoiceItemFormProps {
  index: number;
  handleProductSelect: (product: any) => void; // Adjust type as necessary
}

export function InvoiceItemForm({
  index,
  handleProductSelect,
}: InvoiceItemFormProps) {
  const { control } = useFormContext<InvoiceFormValues>();
  const { branch } = useFormContext<InvoiceFormValues>();

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
            branch={branch} // Pass the branch from the form context
          />
        )}
      />
      {/* Add other form fields as necessary */}
    </div>
  );
}
