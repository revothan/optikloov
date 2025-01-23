import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NumericKeypadDialog } from "./NumericKeypadDialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PrescriptionFieldsProps {
  form: UseFormReturn<any>;
  index: number;
  side: "left" | "right";
}

export function PrescriptionFields({ form, index, side }: PrescriptionFieldsProps) {
  const [activeField, setActiveField] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const formatValue = (value: number | null, type: 'sph' | 'cyl' | 'add') => {
    if (value === null) return '';
    
    const formattedNumber = Math.abs(value).toFixed(2);
    
    switch(type) {
      case 'sph':
        return `${value >= 0 ? '+' : '-'}${formattedNumber}`;
      case 'cyl':
        return value === 0 ? '0.00' : `-${formattedNumber}`;
      case 'add':
        return value === 0 ? '0.00' : `+${formattedNumber}`;
      default:
        return formattedNumber;
    }
  };

  const handleValueChange = (fieldName: string, value: string) => {
    const numericValue = parseFloat(value.replace(/[+\-]/g, ''));
    if (!isNaN(numericValue)) {
      const finalValue = fieldName.includes('cyl') ? -Math.abs(numericValue) :
                        fieldName.includes('add') ? Math.abs(numericValue) :
                        numericValue;
      form.setValue(`items.${index}.${side}_eye.${fieldName.split('.').pop()}`, finalValue);
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
                  inputMode={isMobile ? "none" : "decimal"}
                  {...field}
                  value={formatValue(field.value, 'sph')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
                  onFocus={() => setActiveField(`${field.name}`)}
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
                  inputMode={isMobile ? "none" : "decimal"}
                  {...field}
                  value={formatValue(field.value, 'cyl')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
                  onFocus={() => setActiveField(`${field.name}`)}
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
                  inputMode={isMobile ? "none" : "decimal"}
                  {...field}
                  value={formatValue(field.value, 'add')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
                  onFocus={() => setActiveField(`${field.name}`)}
                  className="text-right"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <NumericKeypadDialog
        open={!!activeField}
        onClose={() => setActiveField(null)}
        onValue={(value) => {
          if (activeField) {
            handleValueChange(activeField, value);
          }
        }}
        allowNegative={activeField?.includes('sph')}
        alwaysNegative={activeField?.includes('cyl')}
        alwaysPositive={activeField?.includes('add_power')}
        initialValue={activeField ? 
          form.getValues(activeField)?.toString().replace(/[+\-]/g, '') || "0" 
          : "0"
        }
      />
    </div>
  );
}