
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PrescriptionFields } from "@/components/invoice/PrescriptionFields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobOrderFormProps {
  selectedItem: any;
  onSuccess: (newStatus: string) => void;
  onClose: () => void;
}

interface FormData {
  items: [{
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
  }];
}

export function JobOrderForm({
  selectedItem,
  onSuccess,
  onClose,
}: JobOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      items: [{
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
      }],
    },
  });

  useEffect(() => {
    if (selectedItem) {
      console.log("Setting form values with selected item:", selectedItem);
      form.reset({
        items: [{
          right_eye: {
            sph: selectedItem.right_eye_sph !== null ? Number(selectedItem.right_eye_sph) : null,
            cyl: selectedItem.right_eye_cyl !== null ? Number(selectedItem.right_eye_cyl) : null,
            axis: selectedItem.right_eye_axis !== null ? Number(selectedItem.right_eye_axis) : null,
            add_power: selectedItem.right_eye_add_power !== null ? Number(selectedItem.right_eye_add_power) : null,
            mpd: selectedItem.right_eye_mpd !== null ? Number(selectedItem.right_eye_mpd) : null,
          },
          left_eye: {
            sph: selectedItem.left_eye_sph !== null ? Number(selectedItem.left_eye_sph) : null,
            cyl: selectedItem.left_eye_cyl !== null ? Number(selectedItem.left_eye_cyl) : null,
            axis: selectedItem.left_eye_axis !== null ? Number(selectedItem.left_eye_axis) : null,
            add_power: selectedItem.left_eye_add_power !== null ? Number(selectedItem.left_eye_add_power) : null,
            mpd: selectedItem.left_eye_mpd !== null ? Number(selectedItem.left_eye_mpd) : null,
          },
          pv: selectedItem.pv !== null ? Number(selectedItem.pv) : null,
          v_frame: selectedItem.v_frame,
          f_size: selectedItem.f_size,
          prism: selectedItem.prism !== null ? Number(selectedItem.prism) : null,
          dbl: selectedItem.dbl !== null ? Number(selectedItem.dbl) : null,
        }],
      });
    }
  }, [selectedItem, form]);

  const onSubmit = async (data: FormData) => {
    if (!selectedItem?.id) return;

    setIsSubmitting(true);
    try {
      console.log("Submitting update with data:", data);

      const { error: updateError } = await supabase
        .from("invoice_items")
        .update({
          right_eye_sph: data.items[0].right_eye.sph,
          right_eye_cyl: data.items[0].right_eye.cyl,
          right_eye_axis: data.items[0].right_eye.axis,
          right_eye_add_power: data.items[0].right_eye.add_power,
          right_eye_mpd: data.items[0].right_eye.mpd,
          left_eye_sph: data.items[0].left_eye.sph,
          left_eye_cyl: data.items[0].left_eye.cyl,
          left_eye_axis: data.items[0].left_eye.axis,
          left_eye_add_power: data.items[0].left_eye.add_power,
          left_eye_mpd: data.items[0].left_eye.mpd,
          pv: data.items[0].pv,
          v_frame: data.items[0].v_frame,
          f_size: data.items[0].f_size,
          prism: data.items[0].prism,
          dbl: data.items[0].dbl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedItem.id);

      if (updateError) throw updateError;

      toast.success("Prescription details updated successfully");
      onSuccess(selectedItem.status);
      onClose();
    } catch (error) {
      console.error("Error updating prescription details:", error);
      toast.error("Failed to update prescription details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  {...form.register("items.0.pv", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prism</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("items.0.prism", { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>V Frame</Label>
                <Input {...form.register("items.0.v_frame")} />
              </div>
              <div className="space-y-2">
                <Label>Frame Size</Label>
                <Input {...form.register("items.0.f_size")} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>DBL</Label>
              <Input
                type="number"
                step="0.01"
                {...form.register("items.0.dbl", { valueAsNumber: true })}
              />
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
