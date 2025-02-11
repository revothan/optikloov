
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
import { useSession } from "@supabase/auth-helpers-react";
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
  right_eye_mpd: string | null;
  left_eye_mpd: string | null;
  right_eye_sph: string | null;
  right_eye_cyl: string | null;
  left_eye_sph: string | null;
  left_eye_cyl: string | null;
}

interface GroupedJobOrder {
  id: string;
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_phone?: string;
  branch: string;
  branch_prefix: string;
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
  const session = useSession();

  const { data: result = { data: [], total: 0 }, isLoading } = useQuery({
    queryKey: ["job-orders", currentPage, searchQuery],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          toast.error("Error fetching user profile");
          throw profileError;
        }

        if (!userProfile) {
          toast.error("User profile not found");
          throw new Error("User profile not found");
        }

        let query = supabase
          .from("job_orders_view")
          .select("*", { count: "exact" });

        if (searchQuery) {
          query = query.ilike("invoice_number", `%${searchQuery}%`);
        }

        if (userProfile.role === "gadingserpongbranch") {
          query = query.eq("branch", "Gading Serpong");
        } else if (userProfile.role === "kelapaduabranch") {
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

        const groupedData = (data as JobOrderViewRow[] || []).reduce((acc: Record<string, GroupedJobOrder>, item) => {
          if (!acc[item.invoice_id]) {
            acc[item.invoice_id] = {
              id: item.invoice_id,
              invoice_number: item.invoice_number,
              sale_date: item.sale_date,
              customer_name: item.customer_name,
              customer_phone: item.customer_phone || undefined,
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
        return { data: [], total: 0 };
      }
    },
    enabled: !!session?.user?.id,
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

  if (isLoading || isPending) {
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
