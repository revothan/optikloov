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
  type: "sph" | "cyl" | "add" | "mpd" | "axis" | "dbl";
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

    if (value === "0" || value === "0.0" || value === "0.00") {
      if (type === "mpd" || type === "dbl") {
        form.setValue(`items.${index}.${side}_eye.${fieldName}`, "0");
      } else {
        form.setValue(`items.${index}.${side}_eye.${fieldName}`, "0.00");
      }
      return;
    }

    if (isValidInput(value, type)) {
      form.setValue(`items.${index}.${side}_eye.${fieldName}`, parseFloat(value));
    }
  };

  const formatValue = (value: number | null) => {
    if (value === null) return "";
    
    if (typeof value === "number") {
      if (value === 0) {
        if (type === "mpd" || type === "dbl") return "0";
        return "0.00";
      }
      
      if (type === "mpd" || type === "dbl") {
        return value.toString();
      }
      
      return value.toFixed(2);
    }
    
    return value;
  };

  const isValidInput = (value: string, type: string): boolean => {
    switch (type) {
      case "sph":
      case "cyl":
        return /^[+-]?\d*\.?\d*$/.test(value);
      case "add":
        return /^\+?\d*\.?\d*$/.test(value);
      case "mpd":
      case "dbl":
        return /^\d*$/.test(value);
      case "axis":
        return /^\d*$/.test(value);
      default:
        return true;
    }
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