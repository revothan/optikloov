
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
          throw userError;
        }
        
        if (!user) {
          console.log("No user found");
          return null;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, branch")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.log("No profile found for user:", user.id);
          return null;
        }

        const userData = {
          id: user.id,
          email: user.email,
          role: profile.role,
          branch: profile.branch
        };
        
        console.log("User data:", userData);
        return userData;
      } catch (error) {
        console.error("Error in useUser hook:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}
