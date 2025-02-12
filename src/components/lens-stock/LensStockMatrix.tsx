
import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockCell } from "./StockCell";
import { StockUpdateDialog } from "./StockUpdateDialog";
import { LensTypeSelect } from "./LensTypeSelect";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfileContext } from "@/contexts/UserProfileContext";

interface LensStock {
  id: string;
  lens_type_id: string;
  sph: number;
  cyl: number;
  quantity: number;
  minimum_stock: number;
  reorder_point: number;
  branch: string;
  lens_type: {
    id: string;
    name: string;
    material: string;
    index: number;
  };
}

export const LensStockMatrix = () => {
  const [selectedLensType, setSelectedLensType] = React.useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<string>("Gading Serpong");
  const userProfile = React.useContext(UserProfileContext);
  
  // SPH range (vertical, -6.00 to +3.00)
  const minusSphRange = Array.from({ length: 25 }, (_, i) => -(i * 0.25)); // 0 to -6.00
  const plusSphRange = Array.from({ length: 13 }, (_, i) => (i * 0.25)); // 0 to +3.00
  const verticalSphRange = [...minusSphRange.reverse(), ...plusSphRange.slice(1)];
  
  // CYL range (horizontal, 0 to -2.00)
  const cylRange = Array.from({ length: 9 }, (_, i) => -(i * 0.25)).sort((a, b) => b - a);
  
  // Set initial branch based on user's branch
  React.useEffect(() => {
    if (userProfile?.branch && userProfile.role !== 'admin') {
      setSelectedBranch(userProfile.branch);
    }
  }, [userProfile?.branch, userProfile?.role]);

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['lens-stock', selectedLensType, selectedBranch],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lens_stock')
        .select('*, lens_type:lens_types(*)')
        .eq('lens_type_id', selectedLensType)
        .eq('branch', selectedBranch);
      
      if (error) throw error;
      return data as LensStock[];
    },
    enabled: !!selectedLensType && !!selectedBranch
  });

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(2);
    return num > 0 ? `+${fixed}` : fixed;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <LensTypeSelect value={selectedLensType} onChange={setSelectedLensType} />
          {userProfile?.role === 'admin' ? (
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gading Serpong">Gading Serpong</SelectItem>
                <SelectItem value="Kelapa Dua">Kelapa Dua</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-2 border rounded-md bg-gray-50">
              {userProfile?.branch}
            </div>
          )}
        </div>
        <StockUpdateDialog 
          lensTypeId={selectedLensType} 
          branch={selectedBranch}
        />
      </div>

      {selectedLensType && (
        <div className="overflow-x-auto">
          <Card className="p-4">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">SPH/CYL</th>
                  {cylRange.map((cyl) => (
                    <th key={cyl} className="p-2 border text-sm">
                      {cyl.toFixed(2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {verticalSphRange.map((sph) => (
                  <tr key={sph}>
                    <td className="p-2 border font-medium">{formatNumber(sph)}</td>
                    {cylRange.map((cyl) => {
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
                          branch={selectedBranch}
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
