import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { toast } from "sonner";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          toast.error("Authentication error. Please login again.");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!currentSession);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial auth check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setIsAuthenticated(false);
        toast.info("You have been signed out");
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
        setIsAuthenticated(true);
        toast.success("Successfully signed in!");
      } else if (event === 'USER_DELETED' || event === 'USER_UPDATED') {
        console.log('User account updated');
        checkAuth(); // Recheck authentication
      }

      setIsLoading(false);
    });

    // Handle token refresh errors
    const handleTokenRefreshError = (error: any) => {
      console.error('Token refresh error:', error);
      setIsAuthenticated(false);
      toast.error("Session expired. Please login again.");
      supabase.auth.signOut(); // Clear the invalid session
    };

    // Add listener for token refresh errors
    window.addEventListener('supabase.auth.refreshSession.error', handleTokenRefreshError);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('supabase.auth.refreshSession.error', handleTokenRefreshError);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider 
        supabaseClient={supabase} 
        initialSession={null}
      >
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
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