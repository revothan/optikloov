// components/LogoutButton.tsx
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-5 w-5" />
      <span>Logout</span> {/* Adding "Logout" text */}
    </Button>
  );
};

export default LogoutButton;
