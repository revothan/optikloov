import { useState } from "react";
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
import { format, parseISO, getMonth, getDate } from "date-fns";
import { Loader2, Cake } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { MessageTemplateDialog } from "@/components/admin/MessageTemplateDialog";
import { SearchInput } from "./common/SearchInput";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export function CustomerTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["customers", currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("customers")
        .select("*", { count: "exact" });

      if (searchQuery) {
        query = query.ilike("phone", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      return { data, total: count || 0 };
    },
  });

  const totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);

  // Function to check if today is someone's birthday (ignoring year)
  const isBirthdayToday = (birthDate: string) => {
    if (!birthDate) return false;
    const today = new Date();
    const birth = parseISO(birthDate);
    return (
      getMonth(today) === getMonth(birth) && getDate(today) === getDate(birth)
    );
  };

  // Count birthdays today
  const birthdaysToday = result.data.filter((customer) =>
    isBirthdayToday(customer.birth_date),
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4">
              <CardTitle>Customers</CardTitle>
              <MessageTemplateDialog />
            </div>
            {birthdaysToday > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {birthdaysToday} birthday{birthdaysToday > 1 ? "s" : ""} today!
                🎉
              </p>
            )}
          </div>
          <div className="w-72">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search phone number..."
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((customer) => (
              <TableRow
                key={customer.id}
                className={cn(
                  isBirthdayToday(customer.birth_date) && "bg-pink-50 hover:bg-pink-100",
                  "transition-colors"
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {customer.name}
                    {isBirthdayToday(customer.birth_date) && (
                      <Cake className="h-4 w-4 text-pink-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.birth_date ? format(parseISO(customer.birth_date), "dd MMM") : "-"}</TableCell>
                <TableCell>
                  {customer.created_at ? format(new Date(customer.created_at), "dd MMM yyyy") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {customer.phone && (
                    <WhatsAppButton phone={customer.phone} name={customer.name} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CustomerTable;
