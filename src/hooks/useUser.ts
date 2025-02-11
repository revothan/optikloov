
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, branch")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        ...profile,
      };
    },
    retry: 1,
    gcTime: 5000,
  });
}
