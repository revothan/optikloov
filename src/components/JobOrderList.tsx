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
import { JobOrderTableRow } from "./job-order/JobOrderTableRow";
import { Loader2 } from "lucide-react";

export function JobOrderList() {
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["job-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          invoice_items!inner (
            *,
            products (*)
          )
        `)
        .contains('invoice_items.products.category', ['Lensa'])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Order #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <JobOrderTableRow key={invoice.id} invoice={invoice} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}