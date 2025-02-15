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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  pv: number | null;
  v_frame: string | null;
  f_size: string | null;
  prism: number | null;
  dbl: number | null;
}

export function JobOrderForm({
  selectedItem,
  onSuccess,
  onClose,
}: JobOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("pending");

  // Initialize form with default values
  const form = useForm<FormData>({
    defaultValues: {
      status: "pending",
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
      pv: null,
      v_frame: null,
      f_size: null,
      prism: null,
      dbl: null,
    },
  });

  // Fetch current status when component mounts
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

  useEffect(() => {
    if (selectedItem) {
      const resetData = {
        status: status as "pending" | "ordered" | "completed",
        right_eye: {
          sph: selectedItem.right_eye_sph,
          cyl: selectedItem.right_eye_cyl,
          axis: selectedItem.right_eye_axis,
          add_power: selectedItem.right_eye_add_power,
          mpd: selectedItem.right_eye_mpd,
        },
        left_eye: {
          sph: selectedItem.left_eye_sph,
          cyl: selectedItem.left_eye_cyl,
          axis: selectedItem.left_eye_axis,
          add_power: selectedItem.left_eye_add_power,
          mpd: selectedItem.left_eye_mpd,
        },
        pv: selectedItem.pv,
        v_frame: selectedItem.v_frame,
        f_size: selectedItem.f_size,
        prism: selectedItem.prism,
        dbl: selectedItem.dbl,
      };

      console.log("Resetting form with actual data:", resetData);
      form.reset(resetData);
    }
  }, [selectedItem]); // Remove status and form from dependencies

  const onSubmit = async (data: FormData) => {
    if (!selectedItem?.id) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting update with data:", data);

      // Update invoice_items table with prescription data
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
          pv: data.pv,
          v_frame: data.v_frame,
          f_size: data.f_size,
          prism: data.prism,
          dbl: data.dbl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      // Create tracking record for status update
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PV</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("pv", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prism</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("prism", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>V Frame</Label>
                  <Input {...form.register("v_frame")} />
                </div>
                <div className="space-y-2">
                  <Label>Frame Size</Label>
                  <Input {...form.register("f_size")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>DBL</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("dbl", { valueAsNumber: true })}
                />
              </div>
            </div>
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
