import { LensStockMatrix } from "@/components/lens-stock/LensStockMatrix";

export default function LensStockPage() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Lens Stock Management</h2>
      <LensStockMatrix />
    </div>
  );
}