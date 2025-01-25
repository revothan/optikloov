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
        <TableHead>Down Payment</TableHead>
        <TableHead>Grand Total</TableHead>
        <TableHead>Sisa Pembayaran</TableHead>
      </TableRow>
    </TableHeader>
  );
}