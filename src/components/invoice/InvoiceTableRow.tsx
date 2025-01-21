import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";
import { formatPrice } from "@/lib/utils";

interface Invoice {
  id: string;
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  discount_amount: number;
  grand_total: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  payment_type: string;
  down_payment: number;
  paid_amount: number;
  remaining_balance: number;
  acknowledged_by: string;
  received_by: string;
}

interface InvoiceTableRowProps {
  invoice: Invoice;
  onDelete: (invoice: Invoice) => void;
}

export function InvoiceTableRow({ invoice, onDelete }: InvoiceTableRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(invoice);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr key={invoice.id}>
      <td className="px-4 py-2">{invoice.invoice_number}</td>
      <td className="px-4 py-2">{invoice.customer_name}</td>
      <td className="px-4 py-2">{formatPrice(invoice.grand_total)}</td>
      <td className="px-4 py-2">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" size="sm" disabled={loading}>
              {loading ? "Loading..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </td>
      <td className="px-4 py-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this invoice? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
}