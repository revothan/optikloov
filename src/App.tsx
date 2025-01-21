import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import LuckyAngpau from "./pages/LuckyAngpau";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Membership from "./pages/Membership";
import ProductDetail from "./pages/ProductDetail";
import { useEffect } from "react";
import EyeCheckPage from "./pages/EyeCheck";
import { WhatsAppButton } from "./components/WhatsAppButton";

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

  useEffect(() => {
    if (!session) {
      // Redirect them to the /login page if not authenticated
      window.location.href = "/login";
    }
  }, [session]);

  return session ? <>{children}</> : null;
};

// WhatsApp button wrapper that hides on admin route
const ConditionalWhatsAppButton = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";
  
  if (isAdminRoute) return null;
  return <WhatsAppButton />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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
            </Routes>
            <ConditionalWhatsAppButton />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;