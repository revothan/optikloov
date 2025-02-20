
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { BranchCode } from "./types";

interface SalesTableProps {
  salesData: any[];
  isAdmin: boolean;
  selectedBranch: BranchCode | null;
}

export function SalesTable({ salesData, isAdmin, selectedBranch }: SalesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment Category</TableHead>
            {(isAdmin || !selectedBranch) && <TableHead>Branch</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData?.length ? (
            salesData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.payment_date), "dd MMM yyyy HH:mm")}
                </TableCell>
                <TableCell>{payment.invoices?.invoice_number}</TableCell>
                <TableCell>{payment.invoices?.customer_name}</TableCell>
                <TableCell>
                  {payment.invoices?.invoice_items
                    ?.map((item: any) => item.products?.name)
                    .filter(Boolean)
                    .join(", ")}
                </TableCell>
                <TableCell>{payment.payment_type}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(payment.amount)}
                </TableCell>
                <TableCell>
                  {payment.is_down_payment ? "Down Payment" : "Final Payment"}
                </TableCell>
                {(isAdmin || !selectedBranch) && (
                  <TableCell>{payment.branch}</TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={isAdmin || !selectedBranch ? 8 : 7}
                className="text-center py-4"
              >
                No transactions found for the selected period
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
