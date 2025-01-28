import { Button } from "@/components/ui/button";
import { InvoicePDF } from "@/components/InvoicePDF";
import { formatPrice } from "@/lib/utils";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
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
  MoreHorizontal,
  Trash,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Extract PaymentStatus component
const PaymentStatus = ({ remaining_balance }: { remaining_balance?: number }) => {
  if (!remaining_balance || remaining_balance <= 0) {
    return <span className="text-green-600 font-medium">LUNAS</span>;
  }
  return (
    <div className="flex flex-col">
      <span className="text-yellow-600 font-medium">Remaining:</span>
      <span className="text-yellow-600">{formatPrice(remaining_balance)}</span>
    </div>
  );
};

// Extract ActionButtons component
const ActionButtons = ({ 
  invoice, 
  items, 
  isPrinting, 
  handlePrint, 
  handleShare,
  handleEmailShare,
  onDelete 
}: {
  invoice: any;
  items: any[];
  isPrinting: boolean;
  handlePrint: () => void;
  handleShare: () => void;
  handleEmailShare: () => void;
  onDelete: (id: string) => Promise<void>;
}) => (
  <div className="flex items-center gap-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePrint} disabled={isPrinting}>
          {isPrinting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Printer className="mr-2 h-4 w-4" />
          )}
          {isPrinting ? "Printing..." : "Print"}
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
            document={<InvoicePDF invoice={invoice} items={items} />}
            fileName={`invoice-${invoice.invoice_number}.pdf`}
          >
            {({ loading }) => (
              <div className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Loading..." : "Download PDF"}
              </div>
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
);

export function InvoiceTableRow({ invoice, onDelete }: { 
  invoice: any; 
  onDelete: (id: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const loadInvoiceItems = async () => {
      try {
        const { data: invoiceItems, error } = await supabase
          .from('invoice_items')
          .select(`
            *,
            products:product_id (
              id,
              name,
              brand,
              category
            )
          `)
          .eq('invoice_id', invoice.id);

        if (error) throw error;
        setItems(invoiceItems || []);
      } catch (error) {
        console.error('Error loading invoice items:', error);
        toast.error('Failed to load invoice items');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoiceItems();
  }, [invoice.id]);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const blob = await pdf(<InvoicePDF invoice={invoice} items={items} />).toBlob();
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          URL.revokeObjectURL(url);
        };
      } else {
        toast.error('Please allow pop-ups to print invoices');
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print invoice');
    } finally {
      setIsPrinting(false);
    }
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <tr className="border-b">
      <td className="py-4 px-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} items={items} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button variant="ghost" size="sm" disabled={loading || isLoading}>
              {loading || isLoading ? "Loading..." : invoice.invoice_number}
            </Button>
          )}
        </PDFDownloadLink>
      </td>
      <td className="py-4 px-4">
        {new Date(invoice.sale_date).toLocaleDateString('id-ID')}
      </td>
      <td className="py-4 px-4">{invoice.customer_name}</td>
      <td className="py-4 px-4">
        <PaymentStatus remaining_balance={invoice.remaining_balance} />
      </td>
      <td className="py-4 px-4">
        <ActionButtons
          invoice={invoice}
          items={items}
          isPrinting={isPrinting}
          handlePrint={handlePrint}
          handleShare={handleShare}
          handleEmailShare={handleEmailShare}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}
