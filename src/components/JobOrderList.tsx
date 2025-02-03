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
          invoice_items (
            *,
            products (*)
          )
        `)
        .not('invoice_items.right_eye_mpd', 'is', null)
        .or('invoice_items.left_eye_mpd.not.is.null')
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to include prescription details
      return data.map(invoice => ({
        ...invoice,
        items: invoice.invoice_items.map(item => ({
          ...item,
          product: item.products,
          right_eye: {
            sph: item.right_eye_sph,
            cyl: item.right_eye_cyl,
            axis: item.right_eye_axis,
            add_power: item.right_eye_add_power,
            mpd: item.right_eye_mpd,
            dbl: item.dbl
          },
          left_eye: {
            sph: item.left_eye_sph,
            cyl: item.left_eye_cyl,
            axis: item.left_eye_axis,
            add_power: item.left_eye_add_power,
            mpd: item.left_eye_mpd,
            dbl: item.dbl
          }
        }))
      }));
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