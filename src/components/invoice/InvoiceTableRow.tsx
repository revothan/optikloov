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
  Loader2,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentTypeDialog } from "./PaymentTypeDialog";

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

export function InvoiceTableRow({ invoice, onDelete }: { 
  invoice: any; 
  onDelete: (id: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentTypeDialog, setShowPaymentTypeDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleConfirmPayment = useCallback(async (paymentType: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('Processing payment...');

      const { error } = await supabase
        .from('invoices')
        .update({ 
          remaining_balance: 0,
          paid_amount: invoice.grand_total,
          status: 'paid',
          payment_type: paymentType
        })
        .eq('id', invoice.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice marked as paid');
      
      // Close dialogs in the correct order
      setShowPaymentTypeDialog(false);
      setIsDropdownOpen(false);
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setIsProcessing(false);
    }
  }, [invoice.id, invoice.grand_total, queryClient, isProcessing]);

  const handlePrint = async () => {
    if (isProcessing || isPrinting) return;
    
    try {
      setIsPrinting(true);
      const blob = await pdf(<InvoicePDF invoice={invoice} items={items} />).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      printWindow?.print();
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to print invoice');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleShare = async () => {
    if (isProcessing) return;
    
    try {
      const blob = await pdf(<InvoicePDF invoice={invoice} items={items} />).toBlob();
      const file = new File([blob], `invoice-${invoice.invoice_number}.pdf`, { type: 'application/pdf' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: `Invoice ${invoice.invoice_number}`,
        });
      } else {
        toast.error('Sharing is not supported on this device');
      }
    } catch (error) {
      console.error('Error sharing invoice:', error);
      toast.error('Failed to share invoice');
    }
  };

  const handleEmailShare = async () => {
    if (!invoice.customer_email) {
      toast.error('No customer email provided');
      return;
    }

    try {
      toast.info('Email sharing will be implemented soon');
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast.error('Failed to send invoice email');
    }
  };

  const handleMarkAsPaid = () => {
    if (!isProcessing) {
      setShowPaymentTypeDialog(true);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <tr className="border-b">
        <td className="py-4 px-4">
          <div className="flex items-center">
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} items={items} />}
              fileName={`invoice-${invoice.invoice_number}.pdf`}
            >
              {invoice.invoice_number}
            </PDFDownloadLink>
          </div>
        </td>
        <td className="py-4 px-4">
          {new Date(invoice.sale_date).toLocaleDateString('id-ID')}
        </td>
        <td className="py-4 px-4">{invoice.customer_name}</td>
        <td className="py-4 px-4">
          <PaymentStatus remaining_balance={invoice.remaining_balance} />
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <DropdownMenu 
              open={isDropdownOpen} 
              onOpenChange={(open) => {
                if (!isProcessing) {
                  setIsDropdownOpen(open);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isProcessing}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {invoice.remaining_balance > 0 && (
                  <DropdownMenuItem onClick={handleMarkAsPaid} disabled={isProcessing}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handlePrint} disabled={isPrinting || isProcessing}>
                  {isPrinting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Printer className="mr-2 h-4 w-4" />
                  )}
                  {isPrinting ? "Printing..." : "Print"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} disabled={isProcessing}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmailShare} disabled={isProcessing}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem asChild disabled={isProcessing}>
                  <div className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    <PDFDownloadLink
                      document={<InvoicePDF invoice={invoice} items={items} />}
                      fileName={`invoice-${invoice.invoice_number}.pdf`}
                    >
                      Download PDF
                    </PDFDownloadLink>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(invoice.id)}
                  className="text-red-600 focus:text-red-600"
                  disabled={isProcessing}
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
      <PaymentTypeDialog
        open={showPaymentTypeDialog}
        onOpenChange={setShowPaymentTypeDialog}
        onConfirm={handleConfirmPayment}
        isProcessing={isProcessing}
      />
    </>
  );
}