
import { SalesReport } from "@/components/SalesReport";
import { useUser } from "@/hooks/useUser";
import { Suspense } from "react";
import { Loader2, Target, TrendingUp } from "lucide-react";
import { normalizeBranchName } from "@/lib/branch-utils";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

const DAILY_TARGET = 7000000; // Rp7.000.000

export default function SalesPage() {
  const { data: user } = useUser();
  
  const isAdmin = user?.role === "admin";
  const userBranch = user?.branch ? normalizeBranchName(user.branch) : "";

  return (
    <div className="p-8">
      {/* Daily Target Card */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Daily Sales Target</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(DAILY_TARGET)}
                </span>
                <span className="text-sm text-gray-600">per day</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Let's achieve this together!</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
