import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionFields } from "@/components/invoice/PrescriptionFields";

interface JobOrderFormProps {
  selectedItem: any;
  onSuccess: (newStatus: string) => void;
  onClose: () => void;
}

interface FormData {
  status: "pending" | "ordered" | "completed";
  right_eye: {
    sph: number | null;
    cyl: number | null;
    axis: number | null;
    add_power: number | null;
    mpd: number | null;
  };
  left_eye: {
    sph: number | null;
    cyl: number | null;
    axis: number | null;
    add_power: number | null;
    mpd: number | null;
  };
}

export function JobOrderForm({
  selectedItem,
  onSuccess,
  onClose,
}: JobOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current status from tracking table
  const [status, setStatus] = useState<string>("pending");

  useEffect(() => {
    const fetchStatus = async () => {
      if (selectedItem?.id) {
        const { data: tracking } = await supabase
          .from("job_order_tracking")
          .select("status")
          .eq("item_id", selectedItem.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (tracking?.[0]?.status) {
          setStatus(tracking[0].status);
        }
      }
    };

    fetchStatus();
  }, [selectedItem]);

  const form = useForm<FormData>({
    defaultValues: {
      status: "pending", // Default to pending, will be updated by useEffect
      right_eye: {
        sph: null,
        cyl: null,
        axis: null,
        add_power: null,
        mpd: null,
      },
      left_eye: {
        sph: null,
        cyl: null,
        axis: null,
        add_power: null,
        mpd: null,
      },
    },
  });

  useEffect(() => {
    if (selectedItem) {
      form.reset({
        status: status as "pending" | "ordered" | "completed",
        right_eye: {
          sph: parseFloat(selectedItem.right_eye?.sph) || null,
          cyl: parseFloat(selectedItem.right_eye?.cyl) || null,
          axis: parseFloat(selectedItem.right_eye?.axis) || null,
          add_power: parseFloat(selectedItem.right_eye?.add_power) || null,
          mpd: parseFloat(selectedItem.right_eye?.mpd) || null,
        },
        left_eye: {
          sph: parseFloat(selectedItem.left_eye?.sph) || null,
          cyl: parseFloat(selectedItem.left_eye?.cyl) || null,
          axis: parseFloat(selectedItem.left_eye?.axis) || null,
          add_power: parseFloat(selectedItem.left_eye?.add_power) || null,
          mpd: parseFloat(selectedItem.left_eye?.mpd) || null,
        },
      });
    }
  }, [selectedItem, status, form]);

  const onSubmit = async (data: FormData) => {
    if (!selectedItem?.id) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting update with data:", data);

      // Update invoice_items table
      const { error: updateError } = await supabase
        .from("invoice_items")
        .update({
          right_eye_sph: data.right_eye.sph,
          right_eye_cyl: data.right_eye.cyl,
          right_eye_axis: data.right_eye.axis,
          right_eye_add_power: data.right_eye.add_power,
          right_eye_mpd: data.right_eye.mpd,
          left_eye_sph: data.left_eye.sph,
          left_eye_cyl: data.left_eye.cyl,
          left_eye_axis: data.left_eye.axis,
          left_eye_add_power: data.left_eye.add_power,
          left_eye_mpd: data.left_eye.mpd,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      // Create tracking record
      const { error: trackingError } = await supabase
        .from("job_order_tracking")
        .insert({
          item_id: selectedItem.id,
          status: data.status,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });

      if (trackingError) throw trackingError;

      toast.success("Job order updated successfully");
      onSuccess(data.status);
      onClose();
    } catch (error) {
      console.error("Error updating job order:", error);
      toast.error("Failed to update job order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Select
            value={form.watch("status")}
            onValueChange={(value) =>
              form.setValue(
                "status",
                value as "pending" | "ordered" | "completed",
              )
            }
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

          <div className="space-y-6">
            <PrescriptionFields form={form} index={0} side="right" />
            <PrescriptionFields form={form} index={0} side="left" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
