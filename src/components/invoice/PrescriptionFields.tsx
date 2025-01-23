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
  const formatValue = (value: number | null, type: 'sph' | 'cyl' | 'add') => {
    if (value === null) return '';
    
    const absValue = Math.abs(value);
    const formattedNumber = absValue.toFixed(2);
    
    switch(type) {
      case 'sph':
        return value >= 0 ? `+${formattedNumber}` : `-${formattedNumber}`;
      case 'cyl':
        return value === 0 ? '0.00' : `-${formattedNumber}`;
      case 'add':
        return value === 0 ? '0.00' : `+${formattedNumber}`;
      default:
        return formattedNumber;
    }
  };

  const handleValueChange = (fieldName: string, value: string) => {
    // Remove any non-numeric characters except decimal point and minus sign
    const cleanedValue = value.replace(/[^\d.-]/g, '');
    
    // Parse the value, considering negative numbers
    let numericValue: number | null = null;
    
    if (cleanedValue !== '' && cleanedValue !== '-') {
      numericValue = parseFloat(cleanedValue);
      
      // Ensure the value has at most 2 decimal places
      if (!isNaN(numericValue)) {
        numericValue = parseFloat(numericValue.toFixed(2));
      }
    }
    
    form.setValue(`items.${index}.${side}_eye.${fieldName.split('.').pop()}`, numericValue);
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
                  value={formatValue(field.value, 'sph')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
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
                  value={formatValue(field.value, 'cyl')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
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
                  value={formatValue(field.value, 'add')}
                  onChange={(e) => handleValueChange(`${field.name}`, e.target.value)}
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