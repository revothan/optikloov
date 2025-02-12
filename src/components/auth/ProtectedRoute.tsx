
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfileContext } from "@/contexts/UserProfileContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles = ["admin", "gadingserpongbranch", "kelapaduabranch"],
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    role?: string;
    branch?: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!currentSession) {
          navigate("/login");
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, branch")
          .eq("id", currentSession.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (!profile || !profile.role || !profile.branch) {
          toast.error("User profile not properly configured");
          navigate("/login");
          return;
        }

        // Check role access
        if (!allowedRoles.includes(profile.role)) {
          toast.error("Access denied");
          navigate("/admin");
          return;
        }

        setUserProfile(profile);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Authentication error");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
}
