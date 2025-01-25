import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InvoiceTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>No. Invoice</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Total</TableHead>
        <TableHead>Down Payment</TableHead>
        <TableHead>Sisa Pembayaran</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}