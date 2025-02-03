import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useCallback } from "react";

interface EyeFieldProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
  fieldName: string;
  label: string;
  type: "sph" | "cyl" | "add" | "mpd" | "axis";
  onComplete?: () => void;
}

export function EyeField({
  form,
  index,
  side,
  fieldName,
  label,
  type,
  onComplete,
}: EyeFieldProps) {
  const formatValue = (value: number | null): string => {
    if (value === null || isNaN(Number(value))) return "";

    const num = Number(value);

    switch (type) {
      case "sph":
        // Always show sign for SPH
        return (num >= 0 ? "+" : "") + num.toFixed(2);
      case "cyl":
        // Always negative or zero for CYL
        return num === 0 ? "0.00" : num.toFixed(2);
      case "add":
        // Always show + sign for ADD power if positive
        return (num >= 0 ? "+" : "") + num.toFixed(2);
      default:
        return String(value);
    }
  };

  const handleValueChange = useCallback(
    (value: string) => {
      const fieldPath = `items.${index}.${side}_eye.${fieldName}`;

      // Allow empty field for new input
      if (value === "" || value === "-" || value === "+") {
        form.setValue(fieldPath, value);
        return;
      }

      // Validate input based on field type
      let isValid = false;
      switch (type) {
        case "sph":
          // Allow both positive and negative decimals
          isValid = /^[+-]?\d*\.?\d*$/.test(value);
          break;
        case "cyl":
          // Only allow negative decimals and zero
          isValid =
            /^-?\d*\.?\d*$/.test(value) &&
            (value === "" || value === "-" || Number(value) <= 0);
          break;
        case "add":
          // Only allow positive decimals and zero
          isValid =
            /^\+?\d*\.?\d*$/.test(value) &&
            (value === "" || value === "+" || Number(value) >= 0);
          break;
        default:
          isValid = /^\d*\.?\d*$/.test(value);
      }

      if (isValid) {
        form.setValue(fieldPath, value);
      }
    },
    [form, index, side, fieldName, type],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const fieldPath = `items.${index}.${side}_eye.${fieldName}`;

    if (!value || value === "-" || value === "+") {
      form.setValue(fieldPath, type === "cyl" ? -0 : 0);
      return;
    }

    let numericValue = parseFloat(value);

    // Apply field-specific rules
    switch (type) {
      case "sph":
        // No additional processing needed, just format
        break;
      case "cyl":
        // Ensure negative or zero
        numericValue = numericValue <= 0 ? numericValue : -numericValue;
        break;
      case "add":
        // Ensure positive or zero
        numericValue =
          numericValue >= 0 ? numericValue : Math.abs(numericValue);
        break;
    }

    if (!isNaN(numericValue)) {
      form.setValue(fieldPath, numericValue);
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
              value={
                field.value === null || field.value === undefined
                  ? ""
                  : typeof field.value === "string"
                    ? field.value
                    : formatValue(field.value)
              }
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="no-spinner"
              inputMode="decimal"
              type="text"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

