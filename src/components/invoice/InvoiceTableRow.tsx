import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { InvoicePDF } from "@/components/InvoicePDF";
import { formatPrice } from "@/lib/utils";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    sale_date: string;
    customer_name: string;
    total_amount: number;
    discount_amount: number;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
    customer_phone?: string;
    customer_address?: string;
    acknowledged_by?: string;
    received_by?: string;
    user_id: string;
  };
  onDelete: (id: string) => Promise<void>;
}

export function InvoiceTableRow({ invoice, onDelete }: InvoiceTableRowProps) {
  return (
    <tr className="border-b">
      <td className="py-4 px-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} items={[]} />}
          fileName={`invoice-${invoice.invoice_number}.pdf`}
        >
          {({ loading }) => (
            <Button variant="ghost" size="sm" disabled={loading}>
              {invoice.invoice_number}
            </Button>
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
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(invoice.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}