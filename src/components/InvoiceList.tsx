import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceTableHeader } from "./invoice/InvoiceTableHeader";
import { InvoiceTableRow } from "./invoice/InvoiceTableRow";
import { InvoicePDF } from "./InvoicePDF";
import { pdf } from "@react-pdf/renderer";

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

  const getInvoiceItems = async (invoiceId: string) => {
    const { data, error } = await supabase
      .from("invoice_items")
      .select(`
        *,
        products (*)
      `)
      .eq("invoice_id", invoiceId);

    if (error) {
      console.error("Error fetching invoice items:", error);
      throw error;
    }
    return data;
  };

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

  const handleShare = async (invoice: any) => {
    if (navigator.share) {
      try {
        const invoiceItems = await getInvoiceItems(invoice.id);
        const blob = await pdf(<InvoicePDF invoice={invoice} items={invoiceItems} />).toBlob();
        const file = new File([blob], `invoice-${invoice.invoice_number}.pdf`, { type: 'application/pdf' });
        
        await navigator.share({
          files: [file],
          title: `Invoice #${invoice.invoice_number}`,
          text: 'Here is your invoice from OPTIK LOOV',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share invoice');
      }
    } else {
      toast.error('Sharing is not supported on this device');
    }
  };

  const handleEmail = async (invoice: any) => {
    toast.info("Email feature coming soon!");
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
              onShare={handleShare}
              onEmail={handleEmail}
              getInvoiceItems={getInvoiceItems}
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