import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
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
  const session = useSession();

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["job-orders", currentPage, searchQuery],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        // First get the user's role from profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        // Determine branch from role
        const branch =
          profile.role === "gadingserpongbranch"
            ? "Gading Serpong"
            : profile.role === "kelapaduabranch"
              ? "Kelapa Dua"
              : null;

        let query = supabase.from("invoices").select(
          `
            id,
            invoice_number,
            sale_date,
            customer_name,
            customer_phone,
            notes,
            branch,
            invoice_items (
              id,
              product_id,
              quantity,
              price,
              discount,
              total,
              right_eye_sph,
              right_eye_cyl,
              right_eye_axis,
              right_eye_add_power,
              right_eye_mpd,
              left_eye_sph,
              left_eye_cyl,
              left_eye_axis,
              left_eye_add_power,
              left_eye_mpd,
              products (
                id,
                name,
                brand,
                category
              )
            )
          `,
          { count: "exact" },
        );

        if (searchQuery) {
          query = query.ilike("invoice_number", `%${searchQuery}%`);
        }

        // For admin, don't filter by branch. For branch users, filter by their branch
        if (profile.role !== "admin" && branch) {
          query = query.eq("branch", branch);
        }

        const { data, error, count } = await query
          .not("invoice_items", "is", null)
          .order("created_at", { ascending: false })
          .range(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE - 1,
          );

        if (error) throw error;

        // Filter invoices that have items with prescription values
        const filteredData = data.filter((invoice) =>
          invoice.invoice_items.some(
            (item) =>
              item.right_eye_sph !== null ||
              item.right_eye_cyl !== null ||
              item.right_eye_axis !== null ||
              item.right_eye_add_power !== null ||
              item.right_eye_mpd !== null ||
              item.left_eye_sph !== null ||
              item.left_eye_cyl !== null ||
              item.left_eye_axis !== null ||
              item.left_eye_add_power !== null ||
              item.left_eye_mpd !== null,
          ),
        );

        return {
          data: filteredData,
          total: filteredData.length,
        };
      } catch (error) {
        console.error("Error loading job orders:", error);
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
            {result.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-4 text-gray-500"
                >
                  No job orders found
                </TableCell>
              </TableRow>
            )}
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

