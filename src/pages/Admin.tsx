import { Suspense, lazy, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { Menu, FileText, Users, ShoppingBag, ClipboardList, TrendingUp, Glasses, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load pages
const InvoicesPage = lazy(() => import("@/pages/admin/InvoicesPage"));
const ProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const CustomersPage = lazy(() => import("@/pages/admin/CustomersPage"));
const JobOrdersPage = lazy(() => import("@/pages/admin/JobOrdersPage"));
const SalesPage = lazy(() => import("@/pages/admin/SalesPage"));
const LensStockPage = lazy(() => import("@/pages/admin/LensStockPage"));

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "invoices", label: "Invoices", path: "/admin/invoices", icon: FileText },
  { id: "products", label: "Products", path: "/admin/products", icon: ShoppingBag },
  { id: "customers", label: "Customers", path: "/admin/customers", icon: Users },
  { id: "job-orders", label: "Job Orders", path: "/admin/job-orders", icon: ClipboardList },
  { id: "sales", label: "Sales", path: "/admin/sales", icon: TrendingUp },
  { id: "lens-stock", label: "Lens Stock", path: "/admin/lens-stock", icon: Glasses },
];

export default function Admin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "border-r bg-white",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "hidden"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo/Brand */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
              {!isCollapsed && <h1 className="text-xl font-bold">Admin</h1>}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1 p-2">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPath === item.path ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-4"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
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

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t">
          <nav className="flex justify-around p-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "flex flex-col items-center justify-center",
                    currentPath === item.path && "text-primary"
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
          "transition-all duration-300 ease-in-out",
          "min-h-screen bg-gray-50",
          isMobile
            ? "pb-20 px-4"
            : isCollapsed
              ? "pl-16"
              : "pl-64"
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
            <Routes>
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/job-orders" element={<JobOrdersPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/lens-stock" element={<LensStockPage />} />
              <Route path="/" element={<Navigate to="/admin/invoices" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}