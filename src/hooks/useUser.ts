
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          return null;
        }
        
        if (!user) return null;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, branch")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          ...profile,
        };
      } catch (error) {
        console.error("Error in useUser hook:", error);
        return null;
      }
    },
    retry: 1,
    gcTime: 5000,
    staleTime: 30000,
  });
}
