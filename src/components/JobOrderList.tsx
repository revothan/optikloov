import { useState, useTransition } from "react";
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
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

interface JobOrderViewRow {
  invoice_id: string;
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_phone: string | null;
  branch: string;
  branch_prefix: string;
  item_id: string;
  right_eye_mpd: number | null;
  left_eye_mpd: number | null;
  right_eye_sph: number | null;
  right_eye_cyl: number | null;
  left_eye_sph: number | null;
  left_eye_cyl: number | null;
  status: string | null;
}

interface GroupedJobOrder {
  id: string;
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_phone?: string;
  branch: string;
  branch_prefix: string;
  status?: string;
  invoice_items: Array<{
    id: string;
    right_eye_mpd: string | null;
    left_eye_mpd: string | null;
    right_eye_sph: string | null;
    right_eye_cyl: string | null;
    left_eye_sph: string | null;
    left_eye_cyl: string | null;
  }>;
}

export function JobOrderList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const { data: userData, isLoading: isUserLoading } = useUser();

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["job-orders", currentPage, searchQuery],
    queryFn: async () => {
      if (!userData?.id) {
        throw new Error("No authenticated user");
      }

      try {
        let query = supabase
          .from("job_orders_view")
          .select("*", { count: "exact" });

        if (searchQuery) {
          query = query.ilike("invoice_number", `%${searchQuery}%`);
        }

        if (userData.role === "gadingserpongbranch") {
          query = query.eq("branch", "Gading Serpong");
        } else if (userData.role === "kelapaduabranch") {
          query = query.eq("branch", "Kelapa Dua");
        }

        const { data, error, count } = await query
          .order("sale_date", { ascending: false })
          .range(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE - 1,
          );

        if (error) {
          toast.error("Error fetching job orders");
          throw error;
        }

        const groupedData = (data as JobOrderViewRow[]).reduce(
          (acc: Record<string, GroupedJobOrder>, item) => {
            if (!acc[item.invoice_id]) {
              acc[item.invoice_id] = {
                id: item.invoice_id,
                invoice_number: item.invoice_number,
                sale_date: item.sale_date,
                customer_name: item.customer_name,
                customer_phone: item.customer_phone || undefined,
                branch: item.branch,
                branch_prefix: item.branch_prefix,
                status: item.status || undefined,
                invoice_items: [],
              };
            }
            acc[item.invoice_id].invoice_items.push({
              id: item.item_id,
              right_eye_mpd: item.right_eye_mpd?.toString() || null,
              left_eye_mpd: item.left_eye_mpd?.toString() || null,
              right_eye_sph: item.right_eye_sph?.toString() || null,
              right_eye_cyl: item.right_eye_cyl?.toString() || null,
              left_eye_sph: item.left_eye_sph?.toString() || null,
              left_eye_cyl: item.left_eye_cyl?.toString() || null,
            });
            return acc;
          },
          {},
        );

        return {
          data: Object.values(groupedData),
          total: count || 0,
        };
      } catch (error) {
        console.error("Error fetching job orders:", error);
        return { data: [], total: 0 };
      }
    },
    enabled: !isUserLoading && !!userData?.id,
    gcTime: 5000,
  });

  const totalPages = Math.ceil(result.total / ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    startTransition(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page);
    });
  };

  if (isLoading || isPending || isUserLoading) {
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
            onChange={handleSearch}
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
              <TableHead>Status</TableHead>
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
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
