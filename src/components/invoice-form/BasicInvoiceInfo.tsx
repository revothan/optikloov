import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BranchSelect } from "./BranchSelect";
import { CustomerFields } from "./CustomerFields";
import { PaymentTypeSelect } from "./PaymentTypeSelect";

interface BasicInvoiceInfoProps {
  form: UseFormReturn<any>;
}

export function BasicInvoiceInfo({ form }: BasicInvoiceInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BranchSelect form={form} />

      <FormField
        control={form.control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Invoice</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-gray-100" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sale_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <CustomerFields form={form} />
      
      <PaymentTypeSelect form={form} />
    </div>
  );
}