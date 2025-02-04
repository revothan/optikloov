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
import { JobOrderTableRow } from "./job-order/JobOrderTableRow";
import { Loader2 } from "lucide-react";
import { SearchInput } from "./common/SearchInput";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export function JobOrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["job-orders", currentPage, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("invoices")
        .select(`
          *,
          invoice_items (
            *,
            products (*)
          )
        `, { count: "exact" });

      if (searchQuery) {
        query = query.ilike("invoice_number", `%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .not('invoice_items', 'is', null)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      // Filter invoices that have items with MPD values
      const filteredData = data.filter(invoice => 
        invoice.invoice_items.some(item => 
          item.right_eye_mpd !== null || item.left_eye_mpd !== null
        )
      );

      return {
        data: filteredData,
        total: count || 0
      };
    },
  });

  const totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search job order number..."
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((invoice) => (
              <JobOrderTableRow key={invoice.id} invoice={invoice} />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}