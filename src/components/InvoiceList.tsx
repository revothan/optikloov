import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InvoiceTableHeader } from "./invoice/InvoiceTableHeader";
import { InvoiceTableRow } from "./invoice/InvoiceTableRow";
import { SearchInput } from "./common/SearchInput";
import { Pagination } from "@/components/ui/pagination";
import { useSession } from "@supabase/auth-helpers-react";
import { isSuperAdmin, getBranchFromRole } from "@/lib/adminPermissions";

const ITEMS_PER_PAGE = 10;

export default function InvoiceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const session = useSession();

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices", currentPage, searchQuery],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No authenticated user");
      }

      try {
        // Get user's role from profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;

        let query = supabase.from("invoices").select(
          `
            id,
            invoice_number,
            sale_date,
            customer_name,
            customer_phone,
            total_amount,
            discount_amount,
            grand_total,
            down_payment,
            remaining_balance,
            payment_type,
            status,
            branch,
            branch_prefix
          `,
          { count: "exact" },
        );

        if (searchQuery) {
          query = query.ilike("invoice_number", `%${searchQuery}%`);
        }

        // Apply branch filter only if not super admin
        if (!isSuperAdmin(profile.role)) {
          const userBranch = getBranchFromRole(profile.role);
          if (!userBranch) {
            throw new Error("Invalid branch configuration");
          }
          query = query.eq("branch", userBranch);
        }

        const {
          data,
          error: invoicesError,
          count,
        } = await query
          .order("created_at", { ascending: false })
          .range(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE - 1,
          );

        if (invoicesError) throw invoicesError;

        return {
          data: data || [],
          total: count || 0,
        };
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        throw err;
      }
    },
    enabled: !!session?.user?.id,
    staleTime: 30000,
    gcTime: 60000,
  });

  const handleDelete = async (id: string) => {
    try {
      console.log("Starting deletion process for invoice:", id);

      // With CASCADE delete, we only need to delete the invoice
      const { error: deleteError } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error deleting invoice:", deleteError);
        throw deleteError;
      }

      console.log("Invoice deleted successfully");
      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    } catch (error) {
      console.error("Error in deletion process:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete invoice");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    startTransition(() => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to first page on search
    });
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setCurrentPage(page);
    });
  };

  const totalPages = Math.ceil((invoices?.total || 0) / ITEMS_PER_PAGE);

  if (error) {
    toast.error("Failed to load invoices");
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        Error loading invoices
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-72">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search invoice number..."
            disabled={isPending}
          />
        </div>
      </div>

      {isLoading || isPending ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <InvoiceTableHeader />
              <TableBody>
                {invoices?.data.map((invoice) => (
                  <InvoiceTableRow
                    key={invoice.id}
                    invoice={invoice}
                    onDelete={handleDelete}
                  />
                ))}
                {invoices?.data.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-muted-foreground"
                    >
                      No invoices found
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isPending}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
