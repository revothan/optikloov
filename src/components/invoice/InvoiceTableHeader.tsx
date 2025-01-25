import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InvoiceTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Invoice Number</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Total Amount</TableHead>
        <TableHead>Down Payment</TableHead>
        <TableHead>Status Pembayaran</TableHead>
      </TableRow>
    </TableHeader>
  );
}