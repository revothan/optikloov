
import { SalesReport } from "@/components/SalesReport";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { normalizeBranchName } from "@/lib/branch-utils";

export default function SalesPage() {
  const { data: user } = useUser();
  
  const isAdmin = user?.role === "admin";
  const userBranch = user?.branch ? normalizeBranchName(user.branch) : "";

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Sales Report</h2>
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <SalesReport userBranch={userBranch} isAdmin={isAdmin} />
      </Suspense>
    </div>
  );
}
