import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MigrateCustomersButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://vdnbihrqujhmmgnshhhn.supabase.co/functions/v1/migrateCustomersFromInvoices",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to migrate customers");
      }

      toast.success("Customers migrated successfully");
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to migrate customers: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleMigration}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Migrating...
        </>
      ) : (
        "Migrate Customers"
      )}
    </Button>
  );
}