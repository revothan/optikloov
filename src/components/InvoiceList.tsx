import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceTableHeader } from "./invoice/InvoiceTableHeader";
import { InvoiceTableRow } from "./invoice/InvoiceTableRow";
import { useEffect } from "react";

export default function InvoiceList() {
  const queryClient = useQueryClient();
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('invoice-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'invoices'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          // Invalidate and refetch invoices when any change occurs
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to invoice changes');
        }
      });

    // Cleanup subscription on component unmount
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Invoice deleted successfully");
      // No need to manually invalidate query here as the real-time subscription will handle it
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
        <p>Error loading invoices</p>
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["invoices"] })}
        >
          Retry
        </button>
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