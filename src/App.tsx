import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      suspense: false, // Disable React Query's suspense mode
    },
  },
});

const AdminRoutes = () => (
  <ErrorBoundary>
    <AdminLayout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="invoices" element={<InvoicesPage />} />
          <Route
            path="products"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "gadingserpongbranch",
                  "kelapaduabranch",
                ]}
              >
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
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "gadingserpongbranch",
                  "kelapaduabranch",
                ]}
              >
                <LensStockPage />
              </ProtectedRoute>
            }
          />
          <Route index element={<Navigate to="/admin/invoices" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  </ErrorBoundary>
);

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase} initialSession={null}>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <AdminRoutes />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/admin" replace />} />
                  <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
