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
  const handleValueChange = (fieldName: string, value: string, type: 'sph' | 'cyl' | 'add') => {
    // Allow typing of decimal numbers and negative signs
    const isValidInput = /^-?\d*\.?\d*$/.test(value);
    
    if (isValidInput || value === '') {
      const numericValue = value === '' ? null : parseFloat(value);
      form.setValue(`items.${index}.${side}_eye.${fieldName.split('.').pop()}`, numericValue);
    }
  };

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
                  type="text"
                  {...field}
                  value={field.value !== null && field.value !== undefined ? field.value.toString() : ''}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value, 'sph')}
                  onBlur={() => {
                    const value = field.value;
                    if (value !== null && value !== undefined) {
                      const formatted = parseFloat(value.toFixed(2));
                      form.setValue(`items.${index}.${side}_eye.sph`, formatted);
                    }
                  }}
                  className="text-right"
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
                  type="text"
                  {...field}
                  value={field.value !== null && field.value !== undefined ? field.value.toString() : ''}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value, 'cyl')}
                  onBlur={() => {
                    const value = field.value;
                    if (value !== null && value !== undefined) {
                      const formatted = parseFloat(value.toFixed(2));
                      form.setValue(`items.${index}.${side}_eye.cyl`, formatted);
                    }
                  }}
                  className="text-right"
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
                    field.onChange(e.target.value ? parseInt(e.target.value) : null)
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
                  type="text"
                  {...field}
                  value={field.value !== null && field.value !== undefined ? field.value.toString() : ''}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value, 'add')}
                  onBlur={() => {
                    const value = field.value;
                    if (value !== null && value !== undefined) {
                      const formatted = parseFloat(value.toFixed(2));
                      form.setValue(`items.${index}.${side}_eye.add_power`, formatted);
                    }
                  }}
                  className="text-right"
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