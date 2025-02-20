
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { startOfDay, endOfDay, startOfToday } from "date-fns";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { DateRangeSelector } from "./sales/DateRangeSelector";
import { ProgressBar } from "./sales/ProgressBar";
import { BranchCode, BranchSales, SalesReportProps, branchMap } from "./sales/types";
import { SalesTable } from "./sales/SalesTable";

export function SalesReport({
  userBranch,
  isAdmin,
  dailyTarget,
}: SalesReportProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfToday(),
    to: startOfToday(),
  });

  const [selectedBranch, setSelectedBranch] = useState<BranchCode | null>(
    () => {
      if (!userBranch || userBranch === "Admin") return null;
      return userBranch;
    },
  );

  const effectiveBranch = useMemo(() => {
    if (!isAdmin) return userBranch === "Admin" ? null : userBranch;
    return selectedBranch;
  }, [isAdmin, userBranch, selectedBranch]);

  const reverseBranchMap = Object.entries(branchMap).reduce(
    (acc, [code, name]) => {
      acc[name] = code;
      return acc;
    },
    {} as Record<string, string>,
  );

  const getBranchDisplayName = (code: BranchCode | null) => {
    if (!code) return "All Branches";
    return branchMap[code];
  };

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["sales-report", dateRange, effectiveBranch],
    queryFn: async () => {
      try {
        let query = supabase
          .from("payments")
          .select(
            `
            *,
            invoices (
              id,
              invoice_number,
              customer_name,
              invoice_items (
                products (
                  name
                )
              )
            )
          `,
          )
          .gte("payment_date", startOfDay(dateRange.from).toISOString())
          .lte("payment_date", endOfDay(dateRange.to).toISOString())
          .order("payment_date", { ascending: false });

        if (effectiveBranch) {
          query = query.eq("branch", branchMap[effectiveBranch]);
        }

        const { data: payments, error: paymentsError } = await query;

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
          throw paymentsError;
        }

        return payments || [];
      } catch (error) {
        console.error("Error in salesData query:", error);
        return [];
      }
    },
  });

  const branchSales = useMemo(() => {
    const initialSales: BranchSales = { GS: 0, KD: 0 };
    
    const todaysSales = salesData?.reduce((acc, payment) => {
      const paymentDate = new Date(payment.payment_date);
      const isToday = paymentDate.toDateString() === new Date().toDateString();
      
      if (isToday) {
        const branchCode = reverseBranchMap[payment.branch] as BranchCode;
        if (branchCode) {
          acc[branchCode] = (acc[branchCode] || 0) + (payment.amount || 0);
        }
      }
      return acc;
    }, initialSales) || initialSales;

    return todaysSales;
  }, [salesData, reverseBranchMap]);

  const branchAchievements = {
    GS: Math.min((branchSales.GS / dailyTarget) * 100, 100),
    KD: Math.min((branchSales.KD / dailyTarget) * 100, 100),
  };

  if (isLoading) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <div className="space-y-6">
          <ProgressBar
            title="Today's Progress - Gading Serpong"
            currentAmount={branchSales.GS}
            targetAmount={dailyTarget}
            achievement={branchAchievements.GS}
          />
          <ProgressBar
            title="Today's Progress - Kelapa Dua"
            currentAmount={branchSales.KD}
            targetAmount={dailyTarget}
            achievement={branchAchievements.KD}
          />
        </div>
      ) : (
        userBranch && userBranch !== "Admin" && (
          <ProgressBar
            title="Today's Progress"
            currentAmount={branchSales[userBranch]}
            targetAmount={dailyTarget}
            achievement={Math.min((branchSales[userBranch] / dailyTarget) * 100, 100)}
          />
        )
      )}

      {isAdmin && (
        <div className="flex items-center gap-4">
          <Select
            value={selectedBranch || "all"}
            onValueChange={(value) =>
              setSelectedBranch(value === "all" ? null : (value as BranchCode))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="GS">Gading Serpong</SelectItem>
              <SelectItem value="KD">Kelapa Dua</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {`Showing sales data for ${getBranchDisplayName(selectedBranch)}`}
          </div>
        </div>
      )}

      {!isAdmin && userBranch && userBranch !== "Admin" && (
        <div className="text-sm text-muted-foreground">
          Showing sales data for {getBranchDisplayName(userBranch as BranchCode)}
        </div>
      )}

      <DateRangeSelector dateRange={dateRange} onDateRangeChange={setDateRange} />

      <SalesTable
        salesData={salesData}
        isAdmin={isAdmin}
        selectedBranch={selectedBranch}
      />
    </div>
  );
}
