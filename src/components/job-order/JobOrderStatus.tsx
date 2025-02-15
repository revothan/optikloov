
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface JobOrderStatusProps {
  itemId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export function JobOrderStatus({ 
  itemId, 
  currentStatus,
  onStatusChange 
}: JobOrderStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error: trackingError } = await supabase
        .from("job_order_tracking")
        .insert({
          item_id: itemId,
          status: newStatus,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (trackingError) throw trackingError;

      toast.success("Status updated successfully");
      onStatusChange(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="ordered">Ordered</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
}
