import { formatPrice } from "@/lib/utils";
import { TableCell, TableRow } from "@/components/ui/table";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    customer_name: string;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
  };
}

export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  return (
    <TableRow>
      <TableCell>{invoice.invoice_number}</TableCell>
      <TableCell>{invoice.customer_name}</TableCell>
      <TableCell>{invoice.down_payment ? formatPrice(invoice.down_payment) : "-"}</TableCell>
      <TableCell>{formatPrice(invoice.grand_total)}</TableCell>
      <TableCell>
        {invoice.remaining_balance && invoice.remaining_balance > 0
          ? formatPrice(invoice.remaining_balance)
          : "LUNAS"}
      </TableCell>
    </TableRow>
  );
}