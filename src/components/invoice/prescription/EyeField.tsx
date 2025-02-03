import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

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
  const handleValueChange = (value: string) => {
    const fieldPath = `items.${index}.${side}_eye.${fieldName}`;

    if (value === "-" || value === "+") {
      form.setValue(fieldPath, value);
      return;
    }

    if (value === "0" || value === "0.0" || value === "0.00") {
      if (type === "mpd" || type === "dbl") {
        form.setValue(fieldPath, "0");
      } else {
        form.setValue(fieldPath, "0.00");
      }
      return;
    }

    form.setValue(fieldPath, value);
  };

  const formatDisplayValue = (value: any): string => {
    if (typeof value === "string") return value;

    if (typeof value === "number") {
      if (value === 0) {
        if (type === "mpd" || type === "dbl") return "0";
        return "0.00";
      }
      
      if (type === "mpd" || type === "dbl") {
        return value.toString();
      }
      
      const absValue = Math.abs(value).toFixed(2);

      switch (type) {
        case "sph":
          return value > 0 ? `+${absValue}` : `-${absValue}`;
        case "cyl":
          return value === 0 ? "0.00" : `-${absValue}`;
        case "add":
          return value === 0 ? "0.00" : `+${absValue}`;
        default:
          return absValue;
      }
    }

    return "";
  };

  const validateInput = (value: string): boolean => {
    switch (type) {
      case "sph":
        return /^[+-]?\d*\.?\d*$/.test(value);
      case "cyl":
        return /^-?\d*\.?\d*$/.test(value);
      case "add":
        return /^\+?\d*\.?\d*$/.test(value);
      case "mpd":
      case "dbl":
        return /^\d*$/.test(value);
      case "axis":
        return /^\d*$/.test(value);
      default:
        return false;
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
              type={type === "axis" ? "number" : "text"}
              {...field}
              value={formatDisplayValue(field.value)}
              onChange={(e) => {
                const newValue = e.target.value;
                if (validateInput(newValue)) {
                  handleValueChange(newValue);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === "0.00") {
                  form.setValue(`items.${index}.${side}_eye.${fieldName}`, 0);
                } else {
                  const num = parseFloat(value.replace(/[+]/g, ""));
                  if (!isNaN(num)) {
                    form.setValue(`items.${index}.${side}_eye.${fieldName}`, num);
                  }
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}