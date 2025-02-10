
import React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import {
  Menu,
  FileText,
  Users,
  ShoppingBag,
  ClipboardList,
  TrendingUp,
  Glasses,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "./pages/Login";
import { toast } from "sonner";

// Lazy-loaded pages
const InvoicesPage = lazy(() => import("@/pages/admin/InvoicesPage"));
const ProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/admin/CustomersPage"));
const JobOrdersPage = lazy(() => import("@/pages/admin/JobOrdersPage"));
const SalesPage = lazy(() => import("@/pages/admin/SalesPage"));
const LensStockPage = lazy(() => import("@/pages/admin/LensStockPage"));

// Exported context for user profile
export const UserProfileContext = React.createContext<{
  role?: string;
  branch?: string;
} | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MENU_ITEMS = [
  {
    id: "invoices",
    label: "Invoices",
    path: "/admin/invoices",
    icon: FileText,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBag,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"], // Updated to allow branch roles
  },
  {
    id: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "job-orders",
    label: "Job Orders",
    path: "/admin/job-orders",
    icon: ClipboardList,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "sales",
    label: "Sales",
    path: "/admin/sales",
    icon: TrendingUp,
    allowedRoles: ["admin", "gadingserpongbranch", "kelapaduabranch"],
  },
  {
    id: "lens-stock",
    label: "Lens Stock",
    path: "/admin/lens-stock",
    icon: Glasses,
    allowedRoles: ["admin"], // Keep lens stock management for admin only
  },
];

const ProtectedRoute = ({
  children,
  allowedRoles = ["admin", "gadingserpongbranch", "kelapaduabranch"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const session = useSession();
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Provide user profile context
  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const userProfile = React.useContext(UserProfileContext);

  // Filter menu items based on user role
  const accessibleMenuItems = MENU_ITEMS.filter(
    (item) => userProfile && item.allowedRoles.includes(userProfile.role!),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "border-r bg-white",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "hidden",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo/Brand with Branch Info */}
            <div className="flex flex-col h-20 justify-center px-4 border-b relative">
              {!isCollapsed && (
                <>
                  <h1 className="text-xl font-bold">Admin</h1>
                  <p className="text-sm text-gray-500">{userProfile?.branch}</p>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute right-2 top-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Items - Filtered by role */}
            <nav className="space-y-1 p-2">
              {accessibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-4",
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon
                      className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className="border-t p-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Filtered by role */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
          <nav className="flex justify-around p-2">
            {accessibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "flex flex-col items-center justify-center",
                    isActive && "text-primary",
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-4",
          "min-h-screen bg-gray-50",
          isMobile ? "pb-20 px-4" : isCollapsed ? "pl-16" : "pl-64",
        )}
      >
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

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
                            <ProtectedRoute allowedRoles={["admin"]}>
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
