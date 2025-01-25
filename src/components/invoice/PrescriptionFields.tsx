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

export function PrescriptionFields({
  form,
  index,
  side,
}: PrescriptionFieldsProps) {
  const handleValueChange = (
    fieldName: string,
    value: string,
    type: "sph" | "cyl" | "add" | "mpd",
  ) => {
    const fieldPath = `items.${index}.${side}_eye.${fieldName.split(".").pop()}`;

    if (value === "-" || value === "+") {
      form.setValue(fieldPath, value);
      return;
    }

    if (value === "0" || value === "0.0" || value === "0.00") {
      // For MPD, use "0" without decimals
      if (type === "mpd") {
        form.setValue(fieldPath, "0");
      } else {
        form.setValue(fieldPath, "0.00");
      }
      return;
    }

    form.setValue(fieldPath, value);
  };

  const formatDisplayValue = (
    value: any,
    type: "sph" | "cyl" | "add" | "mpd",
  ): string => {
    if (typeof value === "string") return value;

    if (typeof value === "number") {
      if (value === 0) {
        // For MPD, return "0" without decimals
        if (type === "mpd") return "0";
        return "0.00";
      }
      
      // For MPD, don't use decimal points
      if (type === "mpd") {
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

  const validateInput = (
    value: string,
    type: "sph" | "cyl" | "add" | "mpd",
  ): boolean => {
    switch (type) {
      case "sph":
        return /^[+-]?\d*\.?\d*$/.test(value);
      case "cyl":
        return /^-?\d*\.?\d*$/.test(value);
      case "add":
        return /^\+?\d*\.?\d*$/.test(value);
      case "mpd":
        return /^\d*$/.test(value); // Only allow whole numbers for MPD
      default:
        return false;
    }
  };

  return (
    <div>
      <h5 className="text-sm font-medium mb-2">
        {side === "left" ? "Left Eye" : "Right Eye"}
      </h5>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`items.${index}.${side}_eye.mpd`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>MPD</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={formatDisplayValue(field.value, "mpd")}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (validateInput(newValue, "mpd")) {
                      handleValueChange(`${field.name}`, newValue, "mpd");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "0") {
                      form.setValue(`items.${index}.${side}_eye.mpd`, 0);
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        form.setValue(`items.${index}.${side}_eye.mpd`, num);
                      }
                    }
                  }}
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