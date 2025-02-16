
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Trophy, Medal, Award, Star, Crown, ListOrdered } from "lucide-react";
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

// Define all PICs and their branches
const ALL_PICS = [
  { name: "Mira", branch: "Gading Serpong" },
  { name: "Tian", branch: "Gading Serpong" },
  { name: "Danny", branch: "Gading Serpong" },
  { name: "Dzaky", branch: "Gading Serpong" },
  { name: "Restu", branch: "Kelapa Dua" },
  { name: "Ilham", branch: "Kelapa Dua" },
  { name: "Ani", branch: "Kelapa Dua" },
  { name: "Wulan", branch: "Kelapa Dua" },
];

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

      // Create a map of existing entries
      const entriesMap = new Map(
        (data as LeaderboardEntry[]).map(entry => [entry.pic_name, entry])
      );

      // Combine with ALL_PICS to include those with no transactions
      const completeData = ALL_PICS.map(pic => ({
        pic_name: pic.name,
        sale_amount: entriesMap.get(pic.name)?.sale_amount || 0,
        invoice_count: entriesMap.get(pic.name)?.invoice_count || 0,
        month: selectedMonth,
        year: selectedYear,
        branch: pic.branch
      }));

      // Sort by sale amount
      return completeData.sort((a, b) => b.sale_amount - a.sale_amount);
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
        return <ListOrdered className="h-8 w-8 text-blue-400" />;
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

      {/* Leaderboard List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gading Serpong Branch */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Gading Serpong</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
              leaderboardData?.filter(entry => entry.branch === "Gading Serpong")
                .map((entry, index) => (
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
                        {index + 1}. {entry.pic_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(entry.sale_amount)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.invoice_count} {entry.invoice_count === 1 ? "transaction" : "transactions"}
                      </p>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>

        {/* Kelapa Dua Branch */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Kelapa Dua</h2>
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
              leaderboardData?.filter(entry => entry.branch === "Kelapa Dua")
                .map((entry, index) => (
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
                        {index + 1}. {entry.pic_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(entry.sale_amount)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.invoice_count} {entry.invoice_count === 1 ? "transaction" : "transactions"}
                      </p>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

