
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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionFields } from "../invoice/PrescriptionFields";
import { Download, Printer, MoreHorizontal, Loader2, Edit } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

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

interface JobOrderFormData {
  status: "pending" | "ordered" | "completed";
  right_eye: {
    sph: number | null;
    cyl: number | null;
    axis: number | null;
    add_power: number | null;
    mpd: number | null;
  };
  left_eye: {
    sph: number | null;
    cyl: number | null;
    axis: number | null;
    add_power: number | null;
    mpd: number | null;
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
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvoiceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<JobOrderFormData>({
    defaultValues: {
      status: "pending",
      right_eye: {
        sph: null,
        cyl: null,
        axis: null,
        add_power: null,
        mpd: null,
      },
      left_eye: {
        sph: null,
        cyl: null,
        axis: null,
        add_power: null,
        mpd: null,
      },
    },
  });

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

        const formattedItems = (invoiceItems || []).map((item) => ({
          id: item.id,
          right_eye_mpd: item.right_eye_mpd?.toString() || null,
          left_eye_mpd: item.left_eye_mpd?.toString() || null,
          right_eye_sph: item.right_eye_sph?.toString() || null,
          right_eye_cyl: item.right_eye_cyl?.toString() || null,
          left_eye_sph: item.left_eye_sph?.toString() || null,
          left_eye_cyl: item.left_eye_cyl?.toString() || null,
          products: item.products,
        }));

        setItems(formattedItems);

        // Load the latest status for the first item
        if (formattedItems.length > 0) {
          const { data: tracking } = await supabase
            .from("job_order_tracking")
            .select("*")
            .eq("item_id", formattedItems[0].id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (tracking && tracking[0]) {
            form.setValue("status", tracking[0].status as "pending" | "ordered" | "completed");
          }
        }
      } catch (error) {
        console.error("Error loading invoice items:", error);
        toast.error("Failed to load invoice items");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoiceItems();
  }, [invoice.id, form]);

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

  const onSubmit = async (data: JobOrderFormData) => {
    if (!selectedItem) return;

    try {
      // Update prescription details
      const { error: updateError } = await supabase
        .from("invoice_items")
        .update({
          right_eye_sph: data.right_eye.sph,
          right_eye_cyl: data.right_eye.cyl,
          right_eye_axis: data.right_eye.axis,
          right_eye_add_power: data.right_eye.add_power,
          right_eye_mpd: data.right_eye.mpd,
          left_eye_sph: data.left_eye.sph,
          left_eye_cyl: data.left_eye.cyl,
          left_eye_axis: data.left_eye.axis,
          left_eye_add_power: data.left_eye.add_power,
          left_eye_mpd: data.left_eye.mpd,
        })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      // Create tracking record
      const { error: trackingError } = await supabase
        .from("job_order_tracking")
        .insert({
          item_id: selectedItem.id,
          status: data.status,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (trackingError) throw trackingError;

      toast.success("Job order updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating job order:", error);
      toast.error("Failed to update job order");
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
        <Badge className={getStatusColor(form.watch("status"))}>
          {form.watch("status")}
        </Badge>
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
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setSelectedItem(items[0]);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Details
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Update Job Order</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="ordered">Ordered</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-4">
                        <PrescriptionFields form={form} index={0} side="right" />
                        <PrescriptionFields form={form} index={0} side="left" />
                      </div>

                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </Form>
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
