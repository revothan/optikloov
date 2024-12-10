import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "@/components/ProductForm";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();

  // Fetch user profile to check role
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    // If there's no session, redirect to login
    if (!session) {
      navigate("/login");
      return;
    }

    // Only redirect if we're not loading and the profile is not admin
    if (!isLoading && profile && profile.role !== "admin") {
      console.log("User is not admin, redirecting", { profile });
      navigate("/");
    }
  }, [session, profile, navigate, isLoading]);

  // Show loading state while checking admin status
  if (isLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  // Only render admin content if user is confirmed as admin
  if (!profile || profile.role !== "admin") {
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
        <h2 className="text-2xl font-semibold mb-6">Tambah Produk Baru</h2>
        <ProductForm />
      </div>
    </div>
  );
};

export default Admin;