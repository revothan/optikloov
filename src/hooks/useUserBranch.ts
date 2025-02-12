import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeBranchName } from "@/lib/branch-utils";

export const useUserBranch = () => {
  return useQuery({
    queryKey: ["user-branch"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("branch")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return normalizeBranchName(profile?.branch || "");
    },
    staleTime: 30000, // Cache for 30 seconds
  });
};
