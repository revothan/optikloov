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
import { Loader2, Trash2, Printer, Share2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WhatsAppButton } from "./admin/WhatsAppButton";
import { Database } from "@/integrations/supabase/types";
import { InvoicePDF } from "./InvoicePDF";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'] & {
  products?: Database['public']['Tables']['products']['Row']
};

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

  const handleShare = async (invoice: any, items: any[]) => {
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-50"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Invoice Preview</DialogTitle>
                      </DialogHeader>
                      <PDFViewer width="100%" height="100%" className="rounded-md">
                        <InvoicePDF 
                          invoice={invoice} 
                          items={[]} 
                          loading={true}
                          onLoadComplete={async () => {
                            const items = await getInvoiceItems(invoice.id);
                            return items;
                          }}
                        />
                      </PDFViewer>
                      <div className="flex justify-end gap-2">
                        <PDFDownloadLink
                          document={<InvoicePDF invoice={invoice} items={[]} />}
                          fileName={`invoice-${invoice.invoice_number}.pdf`}
                        >
                          <Button>
                            Download PDF
                          </Button>
                        </PDFDownloadLink>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleShare(invoice, [])}
                  >
                    <Share2 className="h-4 w-4" />
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