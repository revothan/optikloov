import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUser() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
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
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          // If profile not found, we should create one
          if (profileError.code === "PGRST116") {
            console.log("Profile not found, creating new profile...");
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: user.id,
                  email: user.email,
                  role: "user",
                },
              ])
              .select()
              .single();

            if (createError) {
              console.error("Error creating profile:", createError);
              throw createError;
            }

            return {
              id: user.id,
              email: user.email,
              ...newProfile,
            };
          }
          throw profileError;
        }

        const userData = {
          id: user.id,
          email: user.email,
          ...profile,
        };

        return userData;
      } catch (error) {
        console.error("Error in useUser hook:", error);
        toast.error("Error loading user profile. Please try logging in again.");
        // Sign out the user if we can't load their profile
        await supabase.auth.signOut();
        throw error;
      }
    },
    retry: 1, // Only retry once
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    gcTime: 5000,
    staleTime: 30000,
  });
}
