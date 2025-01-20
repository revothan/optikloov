import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Loader2, Trash2, Printer, MessageCircle, Mail, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WhatsAppButton } from "./admin/WhatsAppButton";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function InvoiceList() {
  const queryClient = useQueryClient();
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

  const handlePrint = (invoice) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Basic HTML template for the invoice
    const html = `
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .amount { text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Invoice</h1>
            <p>Invoice Number: ${invoice.invoice_number}</p>
            <p>Date: ${format(new Date(invoice.sale_date), "dd MMM yyyy")}</p>
          </div>
          <div class="details">
            <p><strong>Customer:</strong> ${invoice.customer_name}</p>
            <p><strong>Address:</strong> ${invoice.customer_address || '-'}</p>
            <p><strong>Phone:</strong> ${invoice.customer_phone || '-'}</p>
          </div>
          <div class="amount">
            <p><strong>Total Amount:</strong> ${formatPrice(invoice.grand_total)}</p>
            <p><strong>Paid Amount:</strong> ${formatPrice(invoice.paid_amount)}</p>
            <p><strong>Remaining Balance:</strong> ${formatPrice(invoice.remaining_balance)}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEmail = async (invoice) => {
    // For now, just show a toast that this feature is coming soon
    toast.info("Email feature coming soon!");
  };

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
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => toast.info("Edit feature coming soon!")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                    onClick={() => handlePrint(invoice)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <WhatsAppButton 
                    phone={invoice.customer_phone || ''} 
                    name={invoice.customer_name}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleEmail(invoice)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!invoices?.length && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}