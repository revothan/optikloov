import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EyeFieldProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
  fieldName: string;
  label: string;
  type: "sph" | "cyl" | "add" | "mpd" | "axis";
}

export function EyeField({
  form,
  index,
  side,
  fieldName,
  label,
  type,
}: EyeFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      form.setValue(`items.${index}.${side}_eye.${fieldName}`, null);
      return;
    }

    // Handle different field types
    switch (type) {
      case "sph":
        // Allow both positive and negative values for SPH
        if (/^[+-]?\d*\.?\d*$/.test(value)) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            form.setValue(`items.${index}.${side}_eye.${fieldName}`, numValue);
          }
        }
        break;

      case "cyl":
        // Always negative for CYL
        if (/^-?\d*\.?\d*$/.test(value)) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            // Ensure it's negative
            const negativeValue = numValue <= 0 ? numValue : -numValue;
            form.setValue(`items.${index}.${side}_eye.${fieldName}`, negativeValue);
          }
        }
        break;

      case "axis":
        // Axis should be a whole number
        if (/^\d*$/.test(value)) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            form.setValue(`items.${index}.${side}_eye.${fieldName}`, numValue);
          }
        }
        break;

      case "add":
        // Always positive for ADD
        if (/^\+?\d*\.?\d*$/.test(value)) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            // Ensure it's positive
            const positiveValue = Math.abs(numValue);
            form.setValue(`items.${index}.${side}_eye.${fieldName}`, positiveValue);
          }
        }
        break;

      case "mpd":
        // MPD should be a number
        if (/^\d*$/.test(value)) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            form.setValue(`items.${index}.${side}_eye.${fieldName}`, numValue);
          }
        }
        break;
    }
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "";
    
    if (typeof value === "number") {
      switch (type) {
        case "sph":
        case "cyl":
        case "add":
          return value === 0 ? "0" : value.toFixed(2);
        case "axis":
        case "mpd":
          return value.toString();
        default:
          return value;
      }
    }
    
    return value;
  };

  return (
    <FormField
      control={form.control}
      name={`items.${index}.${side}_eye.${fieldName}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={formatValue(field.value)}
              onChange={handleChange}
              className="text-center"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}