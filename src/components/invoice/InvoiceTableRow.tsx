import { format } from "date-fns";
import { Loader2, Trash2, Printer, Share2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { WhatsAppButton } from "../admin/WhatsAppButton";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "../InvoicePDF";

interface InvoiceTableRowProps {
  invoice: Database['public']['Tables']['invoices']['Row'];
  onDelete: (id: string) => void;
  onShare: (invoice: any) => void;
  onEmail: (invoice: any) => void;
  getInvoiceItems: (invoiceId: string) => Promise<any[]>;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export function InvoiceTableRow({ 
  invoice, 
  onDelete, 
  onShare, 
  onEmail,
  getInvoiceItems 
}: InvoiceTableRowProps) {
  return (
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
                  onLoadComplete={() => getInvoiceItems(invoice.id)}
                />
              </PDFViewer>
              <div className="flex justify-end gap-2">
                <PDFDownloadLink
                  document={
                    <InvoicePDF 
                      invoice={invoice} 
                      items={[]} 
                      onLoadComplete={() => getInvoiceItems(invoice.id)}
                    />
                  }
                  fileName={`invoice-${invoice.invoice_number}.pdf`}
                >
                  {({ loading }) => (
                    <Button disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        'Download PDF'
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onShare(invoice)}
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
            onClick={() => onEmail(invoice)}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(invoice.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}