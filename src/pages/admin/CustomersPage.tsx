import { CustomerTable } from "@/components/CustomerList";

export default function CustomersPage() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Customers</h2>
      <CustomerTable />
    </div>
  );
}