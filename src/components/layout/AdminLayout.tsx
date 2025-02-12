import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserProfileContext } from "@/contexts/UserProfileContext";
import { MENU_ITEMS } from "@/config/menu-config";

export function AdminLayout({ children }: { children: React.ReactNode }) {
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
            <div className="relative border-b">
              <div className={cn("px-4 py-4", !isCollapsed && "min-h-[160px]")}>
                {!isCollapsed && (
                  <>
                    <h1 className="text-xl font-bold mb-4">Admin Optik LOOV</h1>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 italic">
                        Halo Tim {userProfile?.branch}!
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Untungnya bumi masih berputar, untungnya kita tak pilih
                        menyerah. Semangat kerjanya ya kamu.
                      </p>
                    </div>
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
            </div>

            {/* Navigation Items */}
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

      {/* Mobile Bottom Navigation */}
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
        {children}
      </main>
    </div>
  );
}
