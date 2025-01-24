import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PaymentSignature({ form, totals }) {
  const examiners = ["Mira", "Dzaky", "Wulan", "Danny"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="acknowledged_by"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pemeriksa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pemeriksa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {examiners.map((examiner) => (
                    <SelectItem key={examiner} value={examiner}>
                      {examiner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Amount:</span>
          <span>{totals.totalAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount Amount:</span>
          <span>{totals.discountAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Grand Total:</span>
          <span>{totals.grandTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        </div>
        <div className="flex justify-between">
          <span>Down Payment:</span>
          <span>{totals.downPayment.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Remaining Balance:</span>
          <span>{totals.remainingBalance.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
        </div>
      </div>
    </div>
  );
}