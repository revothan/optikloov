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
        <TableHead>Date</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Total Amount</TableHead>
        <TableHead>Payment Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}