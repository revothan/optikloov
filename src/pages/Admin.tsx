import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ProductDialog } from "@/components/ProductDialog";
import { X } from "lucide-react";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile to check role
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!session) {
      console.log("No session, redirecting to login");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!profileLoading && profile !== undefined) {
      console.log("Profile loaded:", profile);
      if (profile?.role !== 'admin') {
        console.log("User is not admin, redirecting to home");
        navigate("/");
      }
    }
  }, [session, profile, navigate, profileLoading, location]);

  if (profileLoading || productsLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-semibold">{products?.length || 0}</p>
            <p className="text-gray-500">Total Products</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Produk</h2>
          <ProductDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                {product.image_url && (
                  <div className="aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600">Rp {product.store_price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;