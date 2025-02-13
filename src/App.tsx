
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Membership from "./pages/Membership";
import ProductDetail from "./pages/ProductDetail";
import EyeCheckPage from "./pages/EyeCheck";
import { WhatsAppButton } from "./components/WhatsAppButton";
import LuckyAngpau from "./pages/LuckyAngpau";
import KelapaDua from "./pages/KelpaDua";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  if (!session) {
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
};

const isAdminSubdomain = window.location.hostname.startsWith('admin.');

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {isAdminSubdomain ? (
                // Admin subdomain routes
                <>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                // Main site routes
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/luckyangpao" element={<LuckyAngpau />} />
                  <Route path="/visiontest" element={<EyeCheckPage />} />
                  <Route path="/kelapadua" element={<KelapaDua />} />
                </>
              )}
            </Routes>
            {!isAdminSubdomain && <WhatsAppButton />}
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
