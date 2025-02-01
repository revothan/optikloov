import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LensTypeSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const LensTypeSelect: React.FC<LensTypeSelectProps> = ({ value, onChange }) => {
  const { data: lensTypes, isLoading } = useQuery({
    queryKey: ['lens-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lens_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select lens type" />
      </SelectTrigger>
      <SelectContent>
        {lensTypes?.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            {type.name} ({type.material})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};