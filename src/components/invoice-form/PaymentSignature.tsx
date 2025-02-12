import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function PaymentSignature({ form, totals }) {
  const examiners = ["Mira", "Dzaky", "Wulan", "Danny", "Restu", "Ilham"];
  const [paymentOption, setPaymentOption] = useState("custom");

  // Update down payment when payment option changes
  useEffect(() => {
    if (paymentOption === "full") {
      form.setValue("down_payment", totals.grandTotal.toString());
    } else if (paymentOption === "custom") {
      form.setValue("down_payment", "0");
    }
  }, [paymentOption, totals.grandTotal, form]);

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

        <div className="space-y-2">
          <FormLabel>Down Payment</FormLabel>
          <div className="flex gap-2">
            <Select value={paymentOption} onValueChange={setPaymentOption}>
              <FormControl>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="full">LUNAS</SelectItem>
              </SelectContent>
            </Select>
            <FormField
              control={form.control}
              name="down_payment"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={paymentOption === "full"}
                      onChange={(e) => {
                        const value = e.target.value.replace(/^0+/, "");
                        field.onChange(value || "0");
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Amount:</span>
          <span>
            {totals.totalAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Discount Amount:</span>
          <span>
            {totals.discountAmount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Grand Total:</span>
          <span>
            {totals.grandTotal.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Down Payment:</span>
          <span>
            {totals.downPayment.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Remaining Balance:</span>
          <span>
            {totals.remainingBalance.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

