import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import JobOrderPDF from "@/components/invoice-pdf/JobOrderPDF";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

interface JobOrderTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    sale_date: string;
    customer_name: string;
    customer_phone?: string;
    branch: string;
    branch_prefix: string;
  };
}

interface InvoiceItem {
  id: string;
  right_eye_mpd: string | null;
  left_eye_mpd: string | null;
  right_eye_sph: string | null;
  right_eye_cyl: string | null;
  left_eye_sph: string | null;
  left_eye_cyl: string | null;
  products?: {
    id: string;
    name: string;
    brand: string;
    category: string;
  };
}

export function JobOrderTableRow({ invoice }: JobOrderTableRowProps) {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to get the full branch name
  const getBranchFullName = (branchId: string) => {
    return branchId === "KD" ? "Kelapa Dua" : "Gading Serpong";
  };

  useEffect(() => {
    const loadInvoiceItems = async () => {
      try {
        const { data: invoiceItems, error } = await supabase
          .from("invoice_items")
          .select(
            `
            *,
            products:product_id (
              id,
              name,
              brand,
              category
            )
          `,
          )
          .eq("invoice_id", invoice.id);

        if (error) throw error;

        const formattedItems: InvoiceItem[] = (invoiceItems || []).map(
          (item) => ({
            id: item.id,
            right_eye_mpd: item.right_eye_mpd?.toString() || null,
            left_eye_mpd: item.left_eye_mpd?.toString() || null,
            right_eye_sph: item.right_eye_sph?.toString() || null,
            right_eye_cyl: item.right_eye_cyl?.toString() || null,
            left_eye_sph: item.left_eye_sph?.toString() || null,
            left_eye_cyl: item.left_eye_cyl?.toString() || null,
            products: item.products,
          }),
        );

        setItems(formattedItems);
      } catch (error) {
        console.error("Error loading invoice items:", error);
        toast.error("Failed to load invoice items");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoiceItems();
  }, [invoice.id]);

  const handlePrint = async () => {
    if (isPrinting) return;

    try {
      setIsPrinting(true);
      const { data: fullInvoice, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          invoice_items (
            *,
            products (*)
          )
        `,
        )
        .eq("id", invoice.id)
        .single();

      if (error) throw error;

      const blob = await pdf(
        <JobOrderPDF
          invoice={fullInvoice}
          items={fullInvoice.invoice_items}
          branch={getBranchFullName(invoice.branch_prefix)}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      printWindow?.print();
    } catch (error) {
      console.error("Error printing job order:", error);
      toast.error("Failed to print job order");
    } finally {
      setIsPrinting(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <tr className="border-b">
      <td className="py-4 px-4">
        <div className="flex items-center">
          <PDFDownloadLink
            document={
              <JobOrderPDF
                invoice={{ ...invoice }}
                items={items}
                branch={getBranchFullName(invoice.branch_prefix)}
              />
            }
            fileName={`job-order-${invoice.invoice_number}.pdf`}
          >
            {invoice.invoice_number}
          </PDFDownloadLink>
        </div>
      </td>
      <td className="py-4 px-4">
        {new Date(invoice.sale_date).toLocaleDateString("id-ID")}
      </td>
      <td className="py-4 px-4">{invoice.customer_name}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 justify-end">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={handlePrint} disabled={isPrinting}>
                {isPrinting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Printer className="mr-2 h-4 w-4" />
                )}
                {isPrinting ? "Printing..." : "Print"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  <PDFDownloadLink
                    document={
                      <JobOrderPDF
                        invoice={{ ...invoice }}
                        items={items}
                        branch={getBranchFullName(invoice.branch_prefix)}
                      />
                    }
                    fileName={`job-order-${invoice.invoice_number}.pdf`}
                  >
                    Download PDF
                  </PDFDownloadLink>
                </div>
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
