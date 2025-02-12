
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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getFullBranchName, getBranchPrefix } from "@/lib/invoice-utils";

interface SalesReportProps {
  userBranch?: string;
  isAdmin?: boolean;
}

export function SalesReport({ userBranch, isAdmin }: SalesReportProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfToday(),
    to: startOfToday(),
  });

  const { data: salesData, isLoading } = useQuery({
    queryKey: ["sales-report", dateRange, userBranch],
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

      // Apply branch filter if user is not admin
      if (!isAdmin && userBranch) {
        const branchPrefix = getBranchPrefix(userBranch);
        console.log("Filtering payments for branch prefix:", branchPrefix);
        query = query.eq("branch", branchPrefix);
      }

      const { data: payments, error: paymentsError } = await query;

      if (paymentsError) {
        console.error("Error fetching payments:", paymentsError);
        throw paymentsError;
      }

      console.log("Fetched payments:", payments);
      return payments;
    },
    enabled: true,
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

  const handleRangeSelect = (range: string) => {
    const today = new Date();
    switch (range) {
      case "today":
        setDateRange({ from: startOfToday(), to: startOfToday() });
        break;
      case "yesterday":
        const yesterday = sub(today, { days: 1 });
        setDateRange({ from: startOfDay(yesterday), to: endOfDay(yesterday) });
        break;
      case "last7days":
        setDateRange({
          from: startOfDay(sub(today, { days: 6 })),
          to: endOfDay(today),
        });
        break;
      case "thisWeek":
        setDateRange({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        });
        break;
      case "thisMonth":
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Branch indicator for admin */}
      {isAdmin ? (
        <div className="text-sm text-muted-foreground">
          Showing sales data for all branches
        </div>
      ) : userBranch && (
        <div className="text-sm text-muted-foreground">
          Showing sales data for {getFullBranchName(userBranch)}
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
            <div className="text-2xl font-bold">{summary.totalTransactions}</div>
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
            <CardTitle className="text-sm font-medium">Final Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.finalPayments)}
            </div>
            <p className="text-xs text-muted-foreground">Total final payments</p>
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
              {isAdmin && <TableHead>Branch</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.payment_date), "dd MMM yyyy HH:mm")}
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
                {isAdmin && <TableCell>{payment.branch}</TableCell>}
              </TableRow>
            ))}
            {!salesData?.length && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-4">
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
