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
import { Database } from "@/integrations/supabase/types";

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

  const handlePrint = async (invoice) => {
    // First, fetch the invoice items with product details
    const { data: invoiceItems, error } = await supabase
      .from("invoice_items")
      .select(`
        *,
        products (
          name,
          brand
        )
      `)
      .eq("invoice_id", invoice.id);

    if (error) {
      console.error("Error fetching invoice items:", error);
      toast.error("Failed to fetch invoice details");
      return;
    }

    // Group products by product_id to avoid duplicates
    const uniqueProducts = (invoiceItems as InvoiceItem[]).reduce<Record<string, InvoiceItem>>((acc, item) => {
      if (!acc[item.product_id]) {
        acc[item.product_id] = item;
      }
      return acc;
    }, {});

    // Convert back to array
    const uniqueProductsArray = Object.values(uniqueProducts);

    // Find prescription details for right and left eyes
    const rightEye = (invoiceItems as InvoiceItem[]).find(item => item.eye_side === 'right') || invoiceItems[0];
    const leftEye = (invoiceItems as InvoiceItem[]).find(item => item.eye_side === 'left') || invoiceItems[1];

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Basic HTML template for the invoice with separate product and prescription tables
    const html = `
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; position: relative; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .invoice-details { position: absolute; top: 0; right: 0; text-align: right; }
            .details { margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f5f5f5; }
            .amount { text-align: right; margin-top: 20px; }
            .prescription { margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">OPTIK LOOV</div>
            <div class="invoice-details">
              <p><strong>Invoice</strong></p>
              <p>Invoice Number: ${invoice.invoice_number}</p>
              <p>Date: ${format(new Date(invoice.sale_date), "dd MMM yyyy")}</p>
            </div>
          </div>
          <div class="details">
            <p><strong>Customer:</strong> ${invoice.customer_name}</p>
            <p><strong>Address:</strong> ${invoice.customer_address || '-'}</p>
            <p><strong>Phone:</strong> ${invoice.customer_phone || '-'}</p>
          </div>
          
          <!-- Products Table -->
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${uniqueProductsArray.map(item => `
                <tr>
                  <td>${item.products?.name || '-'}</td>
                  <td>${item.products?.brand || '-'}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${formatPrice(item.discount)}</td>
                  <td>${formatPrice(item.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Prescription Table -->
          <div class="prescription">
            <h3>Prescription Details</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Eye</th>
                  <th>SPH</th>
                  <th>CYL</th>
                  <th>AXIS</th>
                  <th>ADD</th>
                  <th>PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Right Eye (OD)</td>
                  <td>${rightEye?.sph || '-'}</td>
                  <td>${rightEye?.cyl || '-'}</td>
                  <td>${rightEye?.axis || '-'}</td>
                  <td>${rightEye?.add_power || '-'}</td>
                  <td>${rightEye?.pd || '-'}</td>
                </tr>
                <tr>
                  <td>Left Eye (OS)</td>
                  <td>${leftEye?.sph || '-'}</td>
                  <td>${leftEye?.cyl || '-'}</td>
                  <td>${leftEye?.axis || '-'}</td>
                  <td>${leftEye?.add_power || '-'}</td>
                  <td>${leftEye?.pd || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="amount">
            <p><strong>Total Amount:</strong> ${formatPrice(invoice.total_amount)}</p>
            <p><strong>Discount:</strong> ${formatPrice(invoice.discount_amount)}</p>
            <p><strong>Grand Total:</strong> ${formatPrice(invoice.grand_total)}</p>
            <p><strong>Paid Amount:</strong> ${formatPrice(invoice.paid_amount || 0)}</p>
            <p><strong>Remaining Balance:</strong> ${formatPrice(invoice.remaining_balance || 0)}</p>
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