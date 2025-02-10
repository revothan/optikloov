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
import { useSession } from "@supabase/auth-helpers-react";

const ITEMS_PER_PAGE = 10;

export function JobOrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["job-orders", currentPage, searchQuery],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        // Get user's profile to check role
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        // Query the job_orders_view
        let query = supabase
          .from("job_orders_view")
          .select("*", { count: "exact" });

        // Apply search filter if exists
        if (searchQuery) {
          query = query.ilike("invoice_number", `%${searchQuery}%`);
        }

        // Apply branch filter based on role
        if (userProfile.role === "gadingserpongbranch") {
          query = query.eq("branch", "Gading Serpong");
        } else if (userProfile.role === "kelapaduabranch") {
          query = query.eq("branch", "Kelapa Dua");
        }
        // Admin sees all branches

        const { data, error, count } = await query
          .order("sale_date", { ascending: false })
          .range(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE - 1,
          );

        if (error) throw error;

        // Group by invoice_id to combine multiple items from same invoice
        const groupedData = data.reduce((acc, item) => {
          if (!acc[item.invoice_id]) {
            acc[item.invoice_id] = {
              id: item.invoice_id,
              invoice_number: item.invoice_number,
              sale_date: item.sale_date,
              customer_name: item.customer_name,
              customer_phone: item.customer_phone,
              notes: item.notes,
              branch: item.branch,
              branch_prefix: item.branch_prefix,
              invoice_items: [],
            };
          }
          acc[item.invoice_id].invoice_items.push({
            id: item.item_id,
            right_eye_mpd: item.right_eye_mpd,
            left_eye_mpd: item.left_eye_mpd,
            right_eye_sph: item.right_eye_sph,
            right_eye_cyl: item.right_eye_cyl,
            left_eye_sph: item.left_eye_sph,
            left_eye_cyl: item.left_eye_cyl,
          });
          return acc;
        }, {});

        return {
          data: Object.values(groupedData),
          total: count || 0,
        };
      } catch (error) {
        console.error("Error fetching job orders:", error);
        throw error;
      }
    },
    enabled: !!session?.user?.id,
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
