import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceTableHeader } from "./invoice/InvoiceTableHeader";
import { InvoiceTableRow } from "./invoice/InvoiceTableRow";
import { SearchInput } from "./common/SearchInput";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function InvoiceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices", currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("invoices")
        .select("*", { count: "exact" });

      if (searchQuery) {
        query = query.ilike("invoice_number", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      return {
        data,
        total: count || 0,
      };
    },
  });

  const handleDelete = async (id: string) => {
    try {
      // First delete associated lens stock movements
      const { error: stockMovementsError } = await supabase
        .from("lens_stock_movements")
        .delete()
        .eq("invoice_id", id);

      if (stockMovementsError) {
        console.error(
          "Error deleting lens stock movements:",
          stockMovementsError,
        );
        toast.error("Failed to delete lens stock movements");
        return;
      }

      // Then delete associated payments
      const { error: paymentsError } = await supabase
        .from("payments")
        .delete()
        .eq("invoice_id", id);

      if (paymentsError) {
        console.error("Error deleting payments:", paymentsError);
        toast.error("Failed to delete associated payments");
        return;
      }

      // Then delete the invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);

      if (itemsError) {
        console.error("Error deleting invoice items:", itemsError);
        toast.error("Failed to delete invoice items");
        return;
      }

      // Finally delete the invoice
      const { error: invoiceError } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);

      if (invoiceError) throw invoiceError;

      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  const totalPages = Math.ceil((invoices?.total || 0) / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search invoice number..."
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <InvoiceTableHeader />
          <TableBody>
            {invoices?.data.map((invoice) => (
              <InvoiceTableRow
                key={invoice.id}
                invoice={invoice}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}