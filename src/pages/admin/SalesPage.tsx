
import { SalesReport } from "@/components/SalesReport";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const DAILY_TARGET = 7000000; // Rp7.000.000

export default function SalesPage() {
  const { data: user } = useUser();
  
  const isAdmin = user?.role === "admin";
  // Pass the branch code directly from the profile
  const userBranch = user?.branch || "";

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Sales Report</h2>
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <SalesReport 
          userBranch={userBranch} 
          isAdmin={isAdmin}
          dailyTarget={DAILY_TARGET}
        />
      </Suspense>
    </div>
  );
}
