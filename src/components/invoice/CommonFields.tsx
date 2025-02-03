import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CommonFieldsProps {
  form: UseFormReturn<any>;
  index: number;
}

export function CommonFields({ form, index }: CommonFieldsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <FormField
        control={form.control}
        name={`items.${index}.pv`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>PV</FormLabel>
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
        name={`items.${index}.prism`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>PRISM</FormLabel>
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
        name={`items.${index}.v_frame`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>V FRAME</FormLabel>
            <FormControl>
              <Input
                type="text"
                {...field}
                onChange={(e) => field.onChange(e.target.value || null)}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`items.${index}.f_size`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>F SIZE</FormLabel>
            <FormControl>
              <Input
                type="text"
                {...field}
                onChange={(e) => field.onChange(e.target.value || null)}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`items.${index}.dbl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>DBL</FormLabel>
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
  );
}