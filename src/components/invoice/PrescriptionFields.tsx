import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useRef } from "react";

interface PrescriptionFieldsProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
}

export function PrescriptionFields({
  form,
  index,
  side,
}: PrescriptionFieldsProps) {
  const handleValueChange = (
    fieldName: string,
    value: string,
    type: "sph" | "cyl" | "add",
  ) => {
    const fieldPath = `items.${index}.${side}_eye.${fieldName.split(".").pop()}`;

    // Handle sign-only input
    if (value === "-" || value === "+") {
      form.setValue(fieldPath, value);
      return;
    }

    // Handle zero values
    if (value === "0" || value === "0.0" || value === "0.00") {
      form.setValue(fieldPath, "0.00");
      return;
    }

    // Keep the raw input value during typing
    form.setValue(fieldPath, value);
  };

  const formatDisplayValue = (
    value: any,
    type: "sph" | "cyl" | "add",
  ): string => {
    if (typeof value === "string") return value;

    if (typeof value === "number") {
      if (value === 0) return "0.00";
      const absValue = Math.abs(value).toFixed(2);

      switch (type) {
        case "sph":
          return value > 0 ? `+${absValue}` : `-${absValue}`;
        case "cyl":
          return value === 0 ? "0.00" : `-${absValue}`;
        case "add":
          return value === 0 ? "0.00" : `+${absValue}`;
      }
    }

    return "";
  };

  const validateInput = (
    value: string,
    type: "sph" | "cyl" | "add",
  ): boolean => {
    switch (type) {
      case "sph":
        return /^[+-]?\d*\.?\d*$/.test(value);
      case "cyl":
        return /^-?\d*\.?\d*$/.test(value);
      case "add":
        return /^\+?\d*\.?\d*$/.test(value);
      default:
        return false;
    }
  };

  return (
    <div>
      <h5 className="text-sm font-medium mb-2">
        {side === "left" ? "Left Eye" : "Right Eye"}
      </h5>
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
                  value={formatDisplayValue(field.value, "sph")}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (validateInput(newValue, "sph")) {
                      handleValueChange(`${field.name}`, newValue, "sph");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "0.00") {
                      form.setValue(`items.${index}.${side}_eye.sph`, 0);
                    } else {
                      const num = parseFloat(value.replace(/[+]/g, ""));
                      if (!isNaN(num)) {
                        form.setValue(`items.${index}.${side}_eye.sph`, num);
                      }
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
                  value={formatDisplayValue(field.value, "cyl")}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (validateInput(newValue, "cyl")) {
                      handleValueChange(`${field.name}`, newValue, "cyl");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "0.00") {
                      form.setValue(`items.${index}.${side}_eye.cyl`, 0);
                    } else {
                      const num = parseFloat(value.replace(/[+]/g, ""));
                      if (!isNaN(num)) {
                        form.setValue(`items.${index}.${side}_eye.cyl`, num);
                      }
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
                    field.onChange(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
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
                  value={formatDisplayValue(field.value, "add")}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (validateInput(newValue, "add")) {
                      handleValueChange(`${field.name}`, newValue, "add");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "0.00") {
                      form.setValue(`items.${index}.${side}_eye.add_power`, 0);
                    } else {
                      const num = parseFloat(value.replace(/[+]/g, ""));
                      if (!isNaN(num)) {
                        form.setValue(
                          `items.${index}.${side}_eye.add_power`,
                          num,
                        );
                      }
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
