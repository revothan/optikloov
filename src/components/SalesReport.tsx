import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  startOfToday,
  startOfDay,
  endOfDay,
  sub,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type BranchCode = "GS" | "KD";

interface SalesReportProps {
  userBranch?: BranchCode | "Admin";
  isAdmin?: boolean;
  dailyTarget: number;
}

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

  const branchMap = {
    GS: "Gading Serpong",
    KD: "Kelapa Dua",
  } as const;

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
    },
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Calculate summary statistics
  const summary = {
    totalSales:
      salesData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0,
    totalTransactions: salesData?.length || 0,
    downPayments:
      salesData?.reduce(
        (sum, payment) =>
          payment.is_down_payment ? sum + (payment.amount || 0) : sum,
        0,
      ) || 0,
    finalPayments:
      salesData?.reduce(
        (sum, payment) =>
          !payment.is_down_payment ? sum + (payment.amount || 0) : sum,
        0,
      ) || 0,
  };

  // Calculate sales for each branch for today
  const branchSales = useMemo(() => {
    const todaysSales = salesData?.reduce((acc, payment) => {
      const paymentDate = new Date(payment.payment_date);
      const isToday = paymentDate.toDateString() === new Date().toDateString();
      
      if (isToday) {
        // Convert full branch name to code for consistency
        const branchCode = reverseBranchMap[payment.branch] as BranchCode;
        if (branchCode) {
          acc[branchCode] = (acc[branchCode] || 0) + (payment.amount || 0);
        }
      }
      return acc;
    }, {} as Record<BranchCode, number>) || {};

    return {
      GS: todaysSales.GS || 0,
      KD: todaysSales.KD || 0,
    };
  }, [salesData, reverseBranchMap]);

  // Calculate achievement percentages for each branch
  const branchAchievements = {
    GS: Math.min((branchSales.GS / dailyTarget) * 100, 100),
    KD: Math.min((branchSales.KD / dailyTarget) * 100, 100),
  };

  return (
    <div className="space-y-6">
      {/* Progress indicators for today's target */}
      {isAdmin ? (
        // Show both branch progress bars for admin
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Progress - Gading Serpong</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(branchSales.GS)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      of {formatPrice(dailyTarget)}
                    </span>
                  </div>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${branchAchievements.GS}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {branchAchievements.GS.toFixed(1)}% achieved
                  </span>
                  <span className="text-gray-600">
                    {formatPrice(Math.max(dailyTarget - branchSales.GS, 0))} to go
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Progress - Kelapa Dua</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(branchSales.KD)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      of {formatPrice(dailyTarget)}
                    </span>
                  </div>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${branchAchievements.KD}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {branchAchievements.KD.toFixed(1)}% achieved
                  </span>
                  <span className="text-gray-600">
                    {formatPrice(Math.max(dailyTarget - branchSales.KD, 0))} to go
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Show single branch progress bar for non-admin users
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium">Today's Progress</h3>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(userBranch ? branchSales[userBranch] : 0)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    of {formatPrice(dailyTarget)}
                  </span>
                </div>
              </div>
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ 
                    width: `${userBranch ? 
                      Math.min((branchSales[userBranch] / dailyTarget) * 100, 100) : 0}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {userBranch ? 
                    ((branchSales[userBranch] / dailyTarget) * 100).toFixed(1) : 0}% achieved
                </span>
                <span className="text-gray-600">
                  {formatPrice(Math.max(dailyTarget - (userBranch ? branchSales[userBranch] : 0), 0))} to go
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branch filter - only show for admin users */}
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

      {/* Branch indicator for non-admin users */}
      {!isAdmin && userBranch && userBranch !== "Admin" && (
        <div className="text-sm text-muted-foreground">
          Showing sales data for{" "}
          {getBranchDisplayName(userBranch as BranchCode)}
        </div>
      )}
      {/* Date Range Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Select onValueChange={handleRangeSelect} defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal w-[280px]")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">For selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Down Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.downPayments)}
            </div>
            <p className="text-xs text-muted-foreground">Total down payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Final Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.finalPayments)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total final payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payment Category</TableHead>
              {(isAdmin || !selectedBranch) && <TableHead>Branch</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin || !selectedBranch ? 8 : 7}
                  className="text-center py-4"
                >
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : salesData?.length ? (
              salesData.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(
                      new Date(payment.payment_date),
                      "dd MMM yyyy HH:mm",
                    )}
                  </TableCell>
                  <TableCell>{payment.invoices?.invoice_number}</TableCell>
                  <TableCell>{payment.invoices?.customer_name}</TableCell>
                  <TableCell>
                    {payment.invoices?.invoice_items
                      ?.map((item) => item.products?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{payment.payment_type}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(payment.amount)}
                  </TableCell>
                  <TableCell>
                    {payment.is_down_payment ? "Down Payment" : "Final Payment"}
                  </TableCell>
                  {(isAdmin || !selectedBranch) && (
                    <TableCell>{payment.branch}</TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isAdmin || !selectedBranch ? 8 : 7}
                  className="text-center py-4"
                >
                  No transactions found for the selected period
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
