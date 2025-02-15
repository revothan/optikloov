import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

const BRANCH_OPTIONS = [
  { value: "Gading Serpong", label: "Gading Serpong" },
  { value: "Kelapa Dua", label: "Kelapa Dua" },
] as const;

export function BranchSelect({ form }: BranchSelectProps) {
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
        console.error("Profile Fetch Error:", error);
        throw error;
      }

      // Convert branch code to full name
      let branchName = data?.branch;
      if (
        branchName === "GS" ||
        branchName?.toLowerCase() === "gadingserpongbranch"
      ) {
        branchName = "Gading Serpong";
      } else if (
        branchName === "KD" ||
        branchName?.toLowerCase() === "kelapaduabranch"
      ) {
        branchName = "Kelapa Dua";
      }

      return {
        ...data,
        branch: branchName,
      };
    },
    refetchOnWindowFocus: false,
  });

  // Set branch value whenever userProfile changes
  useEffect(() => {
    if (userProfile?.branch) {
      console.log("Setting branch value to:", userProfile.branch);
      form.setValue("branch", userProfile.branch);
    }
  }, [userProfile, form]);

  return (
    <FormField
      control={form.control}
      name="branch"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Branch</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              console.log("Branch selected:", value);
              field.onChange(value);
            }}
            disabled={true}
          >
            <FormControl>
              <SelectTrigger className="bg-gray-100">
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {BRANCH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
