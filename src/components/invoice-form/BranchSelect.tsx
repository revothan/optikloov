import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface BranchSelectProps {
  form: UseFormReturn<any>;
}

export function BranchSelect({ form }: BranchSelectProps) {
  const session = useSession();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No active user session");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Profile Fetch Error:", {
          message: error.message,
          details: error.details,
          code: error.code,
        });
        throw error;
      }

      // Get branch from profile data
      const branchData = data?.branch || data?.role;
      if (!branchData) {
        throw new Error("Cannot determine user's branch");
      }

      // Convert branch code to full name if needed
      const fullBranchName =
        branchData === "GS" || branchData === "gs"
          ? "Gading Serpong"
          : branchData === "KD" || branchData === "kd"
            ? "Kelapa Dua"
            : branchData;

      return {
        ...data,
        branch: fullBranchName,
      };
    },
    refetchOnWindowFocus: false,
  });

  // Set branch value whenever userProfile changes
  useEffect(() => {
    if (userProfile?.branch) {
      form.setValue("branch", userProfile.branch);
    }
  }, [userProfile, form]);

  return (
    <FormField
      control={form.control}
      name="branch"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cabang</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={userProfile?.branch || field.value}
            disabled={true}
          >
            <FormControl>
              <SelectTrigger className="bg-gray-100">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Gading Serpong">Gading Serpong</SelectItem>
              <SelectItem value="Kelapa Dua">Kelapa Dua</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

