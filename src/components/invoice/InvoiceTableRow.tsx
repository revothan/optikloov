import { Button } from "@/components/ui/button";
import { InvoicePDF } from "@/components/InvoicePDF";
import { formatPrice } from "@/lib/utils";
import { PDFDownloadLink, PDFDownloadLinkProps } from "@react-pdf/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  Printer, 
  Share2, 
  Mail, 
  MessageCircle,
  MoreHorizontal,
  Trash
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { Fragment } from "react";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    customer_name: string;
    total_amount: number;
    discount_amount: number;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
    customer_phone?: string;
  };
  onDelete: (id: string) => Promise<void>;
}

export function InvoiceTableRow({ invoice, onDelete }: InvoiceTableRowProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Invoice #${invoice.invoice_number}`,
          text: `Invoice for ${invoice.customer_name}`,
          url: window.location.href,
        });
      } else {
        toast.error("Sharing is not supported on this device");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share invoice");
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Invoice #${invoice.invoice_number}`);
    const body = encodeURIComponent(
      `Invoice details for ${invoice.customer_name}\nAmount: ${formatPrice(invoice.grand_total)}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <tr className="border-b">
      <td className="py-4 px-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} items={[]} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Fragment>
              <Button variant="ghost" size="sm" disabled={loading}>
                {loading ? "Loading..." : invoice.invoice_number}
              </Button>
            </Fragment>
          )}
        </PDFDownloadLink>
      </td>
      <td className="py-4 px-4">{invoice.customer_name}</td>
      <td className="py-4 px-4">{formatPrice(invoice.total_amount)}</td>
      <td className="py-4 px-4">{formatPrice(invoice.discount_amount)}</td>
      <td className="py-4 px-4">{formatPrice(invoice.grand_total)}</td>
      <td className="py-4 px-4">
        {invoice.down_payment ? formatPrice(invoice.down_payment) : "-"}
      </td>
      <td className="py-4 px-4">
        {invoice.remaining_balance ? formatPrice(invoice.remaining_balance) : "-"}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEmailShare}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <PDFDownloadLink
                  document={<InvoicePDF invoice={invoice} items={[]} />}
                  fileName={`invoice-${invoice.invoice_number}.pdf`}
                >
                  {({ loading }) => (
                    <Fragment>
                      <div className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        {loading ? "Loading..." : "Download PDF"}
                      </div>
                    </Fragment>
                  )}
                </PDFDownloadLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(invoice.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {invoice.customer_phone && (
            <WhatsAppButton
              phone={invoice.customer_phone}
              name={invoice.customer_name}
            />
          )}
        </div>
      </td>
    </tr>
  );
}