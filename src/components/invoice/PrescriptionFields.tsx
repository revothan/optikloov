import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PrescriptionFieldsProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
}

export function PrescriptionFields({ form, index, side }: PrescriptionFieldsProps) {
  return (
    <div>
      <h5 className="text-sm font-medium mb-2">{side === "left" ? "Left Eye" : "Right Eye"}</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name={`items.${index}.${side}_eye.sph`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SPH</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.25"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`items.${index}.${side}_eye.cyl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CYL</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.25"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`items.${index}.${side}_eye.axis`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>AXIS</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`items.${index}.${side}_eye.add_power`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ADD</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.25"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}