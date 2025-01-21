import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

interface PaymentSignatureProps {
  form: UseFormReturn<any>;
  totals: {
    totalAmount: number;
    discountAmount: number;
    grandTotal: number;
    downPayment: number;
    remainingBalance: number;
  };
}

export function PaymentSignature({ form, totals }: PaymentSignatureProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="down_payment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uang Muka (DP)</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">Rp</span>
                  <Input
                    type="number"
                    className="pl-12"
                    placeholder="0"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acknowledged_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diketahui Oleh</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="received_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diterima Oleh</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2 text-right">
        <div className="text-sm text-muted-foreground">
          Total: {formatPrice(totals.totalAmount)}
        </div>
        <div className="text-sm text-muted-foreground">
          Discount: {formatPrice(totals.discountAmount)}
        </div>
        <div className="text-lg font-semibold">
          Grand Total: {formatPrice(totals.grandTotal)}
        </div>
        <div className="text-sm text-muted-foreground">
          Down Payment: {formatPrice(totals.downPayment)}
        </div>
        <div className="text-sm font-medium">
          Remaining: {formatPrice(totals.remainingBalance)}
        </div>
      </div>
    </div>
  );
}