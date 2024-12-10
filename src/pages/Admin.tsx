import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ProductDialog } from "@/components/ProductDialog";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile to check role
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        console.log("No user ID available");
        return null;
      }
      
      console.log("Fetching profile for user:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      console.log("No session, redirecting to login");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!isLoading && profile !== undefined) {
      console.log("Profile loaded:", profile);
      if (profile?.role !== 'admin') {
        console.log("User is not admin, redirecting to home");
        navigate("/");
      }
    }
  }, [session, profile, navigate, isLoading, location]);

  // Show loading state while checking admin status
  if (isLoading || profile === undefined) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  // Only render admin content if user is confirmed as admin
  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-gray-500">Total Products</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Produk</h2>
          <ProductDialog />
        </div>
      </div>
    </div>
  );
};

export default Admin;