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
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function SalesReport() {
  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales-report"],
    queryFn: async () => {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select(`
          *,
          invoice_items (
            products (
              name
            )
          )
        `)
        .order('sale_date', { ascending: false });

      if (error) throw error;
      return invoices;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Sale Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Paid Amount</TableHead>
            <TableHead>Payment Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales?.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.customer_name}</TableCell>
              <TableCell>
                {new Date(sale.sale_date).toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>
                {sale.invoice_items
                  ?.map((item) => item.products?.name)
                  .filter(Boolean)
                  .join(", ")}
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(sale.grand_total)}
              </TableCell>
              <TableCell className="text-right">
                {formatPrice(sale.paid_amount || sale.down_payment || 0)}
              </TableCell>
              <TableCell>{sale.payment_type || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}