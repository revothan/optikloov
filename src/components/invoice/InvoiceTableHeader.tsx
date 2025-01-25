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
        <TableHead>Customer Name</TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}