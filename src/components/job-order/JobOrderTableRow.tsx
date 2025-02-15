import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import JobOrderPDF from "@/components/invoice-pdf/JobOrderPDF";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Printer, MoreHorizontal, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { JobOrderForm } from "@/components/JobOrderForm"; // We'll create this component separately

interface JobOrderTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    sale_date: string;
    customer_name: string;
    customer_phone?: string;
    branch: string;
    branch_prefix: string;
    status?: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "ordered":
      return "bg-blue-500";
    case "completed":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export function JobOrderTableRow({ invoice }: JobOrderTableRowProps) {
  const [items, setItems] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    invoice.status || "pending",
  );
  const queryClient = useQueryClient();

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

        setItems(invoiceItems || []);

        // Load the latest status
        if (invoiceItems?.[0]) {
          const { data: tracking } = await supabase
            .from("job_order_tracking")
            .select("*")
            .eq("item_id", invoiceItems[0].id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (tracking?.[0]) {
            setCurrentStatus(tracking[0].status);
          }
        }

        // Set the first item as selected by default
        if (invoiceItems?.[0]) {
          setSelectedItem(invoiceItems[0]);
        }
        if (invoiceItems?.[0]) {
          console.log("Loaded invoice item:", invoiceItems[0]);
        }
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

  const handleUpdateSuccess = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    setIsDialogOpen(false);

    // Re-fetch invoice items to get updated data
    const { data: updatedItems } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.id);

    if (updatedItems) {
      setItems(updatedItems);
      setSelectedItem(updatedItems[0]); // Update selectedItem with latest data
    }

    queryClient.invalidateQueries({ queryKey: ["job-orders"] });
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
        <Badge className={getStatusColor(currentStatus)}>{currentStatus}</Badge>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 justify-end">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Update Job Order</DialogTitle>
                  </DialogHeader>
                  {selectedItem ? (
                    <JobOrderForm
                      selectedItem={selectedItem}
                      onSuccess={handleUpdateSuccess}
                      onClose={() => setIsDialogOpen(false)}
                    />
                  ) : (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <DropdownMenuSeparator />
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
