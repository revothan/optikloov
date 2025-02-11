
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        console.log("Fetching user session...");
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          throw userError;
        }
        
        if (!user) {
          console.log("No user found");
          return null;
        }

        console.log("Fetching user profile...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, branch")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw profileError;
        }

        const userData = {
          id: user.id,
          email: user.email,
          ...profile,
        };
        
        console.log("User data:", userData);
        return userData;
      } catch (error) {
        console.error("Error in useUser hook:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    gcTime: 5000,
    staleTime: 30000,
  });
}
