import { InvoiceDialog } from "@/components/InvoiceDialog";
import InvoiceList from "@/components/InvoiceList";

export default function InvoicesPage() {
  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Invoices</h2>
          <InvoiceDialog />
        </div>
        <InvoiceList />
      </div>
    </div>
  );
}