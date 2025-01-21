import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceTableHeader } from "./invoice/InvoiceTableHeader";
import { InvoiceTableRow } from "./invoice/InvoiceTableRow";

export function InvoiceList() {
  const queryClient = useQueryClient();
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <p>Error loading invoices. Please try again later.</p>
        <p className="text-sm text-gray-500 mt-2">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <InvoiceTableHeader />
        <TableBody>
          {invoices?.map((invoice) => (
            <InvoiceTableRow
              key={invoice.id}
              invoice={invoice}
              onDelete={handleDelete}
            />
          ))}
          {!invoices?.length && (
            <tr>
              <td colSpan={7} className="text-center text-muted-foreground p-4">
                No invoices found
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}