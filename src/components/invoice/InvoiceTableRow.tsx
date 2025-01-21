import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { formatCurrency } from "@/lib/utils";

interface InvoiceTableRowProps {
  invoice: Tables<"invoices">;
  items: Tables<"invoice_items">[];
  onPrint: (invoice: Tables<"invoices">) => void;
  onDelete: (invoice: Tables<"invoices">) => void;
}

export function InvoiceTableRow({
  invoice,
  items,
  onPrint,
  onDelete,
}: InvoiceTableRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <tr key={invoice.id} className="border-b">
      <td className="py-4">{invoice.invoice_number}</td>
      <td>{invoice.customer_name}</td>
      <td>{formatCurrency(invoice.total_amount)}</td>
      <td>{formatCurrency(invoice.discount_amount)}</td>
      <td>{formatCurrency(invoice.grand_total)}</td>
      <td>{invoice.payment_type}</td>
      <td>{new Date(invoice.sale_date).toLocaleDateString()}</td>
      <td>
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPrint(invoice)}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} items={items} />}
            fileName={`invoice-${invoice.invoice_number}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
          </PDFDownloadLink>

          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(invoice);
                }}
              >
                Delete Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}