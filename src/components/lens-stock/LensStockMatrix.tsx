import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockCell } from "./StockCell";
import { StockUpdateDialog } from "./StockUpdateDialog";
import { LensTypeSelect } from "./LensTypeSelect";

export const LensStockMatrix = () => {
  const [selectedLensType, setSelectedLensType] = React.useState<string | null>(null);
  
  // CYL range (vertical, 0 to -2.00)
  const cylRange = Array.from({ length: 9 }, (_, i) => -(i * 0.25));
  
  // SPH range (horizontal, -6.00 to +3.00)
  const minusSphRange = Array.from({ length: 25 }, (_, i) => -(i * 0.25)); // 0 to -6.00
  const plusSphRange = Array.from({ length: 13 }, (_, i) => (i * 0.25)); // 0 to +3.00
  const horizontalSphRange = [...minusSphRange.reverse(), ...plusSphRange.slice(1)];
  
  const { data: stockData, isLoading } = useQuery({
    queryKey: ['lens-stock', selectedLensType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lens_stock')
        .select('*, lens_type:lens_types(*)')
        .eq('lens_type_id', selectedLensType);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedLensType
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <LensTypeSelect value={selectedLensType} onChange={setSelectedLensType} />
        <StockUpdateDialog lensTypeId={selectedLensType} />
      </div>

      {selectedLensType && (
        <div className="overflow-x-auto">
          <Card className="p-4">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">CYL/SPH</th>
                  {horizontalSphRange.map((sph) => (
                    <th key={sph} className="p-2 border text-sm">
                      {sph.toFixed(2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cylRange.map((cyl) => (
                  <tr key={cyl}>
                    <td className="p-2 border font-medium">{cyl.toFixed(2)}</td>
                    {horizontalSphRange.map((sph) => {
                      const stockItem = stockData?.find(
                        (item) => item.sph === sph && item.cyl === cyl
                      );
                      return (
                        <StockCell
                          key={`${sph}-${cyl}`}
                          stock={stockItem}
                          sph={sph}
                          cyl={cyl}
                          lensTypeId={selectedLensType}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};