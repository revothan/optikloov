
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  pic_name: string;
  sale_amount: number;
  invoice_count: number;
  month: number;
  year: number;
  branch: string;
}

export default function PICLeaderboardPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["pic-leaderboard", selectedMonth, selectedYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pic_sales")
        .select("*")
        .eq("month", selectedMonth)
        .eq("year", selectedYear)
        .order("sale_amount", { ascending: false });

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  // Generate array of last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      value: i + 1,
      label: format(date, "MMMM"),
    };
  });

  // Generate array of years (current year and previous year)
  const yearOptions = [
    currentDate.getFullYear(),
    currentDate.getFullYear() - 1,
  ];

  // Rank badges
  const RankBadge = ({ rank }: { rank: number }) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <Star className="h-8 w-8 text-blue-400" />;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with Period Selection */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Crown className="h-8 w-8 text-yellow-500" />
          {format(new Date(selectedYear, selectedMonth - 1), "MMMM yyyy")} Leaderboard
        </h1>
        <div className="flex gap-4">
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Actual leaderboard entries
          leaderboardData?.map((entry, index) => (
            <Card 
              key={entry.pic_name} 
              className={cn(
                "relative overflow-hidden transition-transform hover:scale-105",
                index === 0 && "border-yellow-500 shadow-yellow-200",
                index === 1 && "border-gray-400 shadow-gray-200",
                index === 2 && "border-amber-600 shadow-amber-200"
              )}
            >
              <div className="absolute top-4 right-4">
                <RankBadge rank={index + 1} />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {entry.pic_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{entry.branch}</p>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(entry.sale_amount)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {entry.invoice_count} invoices this month
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && (!leaderboardData || leaderboardData.length === 0) && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No sales data available for this period.</p>
        </Card>
      )}
    </div>
  );
}
