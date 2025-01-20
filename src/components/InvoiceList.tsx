import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function InvoiceList() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoice_number}
              </TableCell>
              <TableCell>
                {format(new Date(invoice.sale_date), "dd MMM yyyy")}
              </TableCell>
              <TableCell>{invoice.customer_name}</TableCell>
              <TableCell>{formatPrice(invoice.grand_total)}</TableCell>
              <TableCell>{invoice.payment_type || "-"}</TableCell>
              <TableCell>
                {invoice.remaining_balance > 0 ? (
                  <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs">
                    Partial
                  </span>
                ) : (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {!invoices?.length && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}