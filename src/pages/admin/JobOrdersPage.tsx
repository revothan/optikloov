import { JobOrderList } from "@/components/JobOrderList";

export default function JobOrdersPage() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Job Orders</h2>
      <JobOrderList />
    </div>
  );
}