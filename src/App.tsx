
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";

// Lazy-loaded pages
const InvoicesPage = lazy(() => import("@/pages/admin/InvoicesPage"));
const ProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/admin/CustomersPage"));
const JobOrdersPage = lazy(() => import("@/pages/admin/JobOrdersPage"));
const SalesPage = lazy(() => import("@/pages/admin/SalesPage"));
const LensStockPage = lazy(() => import("@/pages/admin/LensStockPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={null}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="invoices" element={<InvoicesPage />} />
                        <Route 
                          path="products" 
                          element={
                            <ProtectedRoute allowedRoles={["admin", "gadingserpongbranch", "kelapaduabranch"]}>
                              <ProductsPage />
                            </ProtectedRoute>
                          } 
                        />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="job-orders" element={<JobOrdersPage />} />
                        <Route path="sales" element={<SalesPage />} />
                        <Route 
                          path="lens-stock" 
                          element={
                            <ProtectedRoute allowedRoles={["admin", "gadingserpongbranch", "kelapaduabranch"]}>
                              <LensStockPage />
                            </ProtectedRoute>
                          } 
                        />
                        {/* Default redirect for /admin */}
                        <Route
                          index
                          element={<Navigate to="/admin/invoices" replace />}
                        />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              {/* Redirect root and any other routes to /admin */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
