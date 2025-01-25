import { TableCell, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface InvoiceTableRowProps {
  invoice: {
    id: string;
    invoice_number: string;
    customer_name: string;
    total_amount: number;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
  };
}

export function InvoiceTableRow({ invoice }: InvoiceTableRowProps) {
  const getPaymentStatus = () => {
    if (!invoice.remaining_balance || invoice.remaining_balance <= 0) {
      return <span className="font-semibold text-green-600">LUNAS</span>;
    }
    return <span className="text-orange-600">{formatPrice(invoice.remaining_balance)}</span>;
  };

  return (
    <TableRow>
      <TableCell>{invoice.invoice_number}</TableCell>
      <TableCell>{invoice.customer_name}</TableCell>
      <TableCell>{formatPrice(invoice.grand_total)}</TableCell>
      <TableCell>{invoice.down_payment ? formatPrice(invoice.down_payment) : "-"}</TableCell>
      <TableCell>{getPaymentStatus()}</TableCell>
      <TableCell>
        <div className="relative">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>View Details</ContextMenuItem>
              <ContextMenuItem>Print Invoice</ContextMenuItem>
              <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}