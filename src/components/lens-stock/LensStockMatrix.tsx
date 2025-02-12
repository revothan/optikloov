
import React from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StockCell } from "./StockCell";
import { StockUpdateDialog } from "./StockUpdateDialog";
import { LensTypeSelect } from "./LensTypeSelect";
import { getBranchPrefix } from "@/lib/branch-utils";
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

// Helper to normalize branch names both ways
const branchMap: Record<string, string> = {
  "GS": "GS",
  "KD": "KD",
  "Gading Serpong": "GS",
  "Kelapa Dua": "KD",
  "gadingserpongbranch": "GS",
  "kelapaduabranch": "KD"
};

const normalizeBranchName = (branch: string | undefined) => {
  if (!branch) return "GS";
  const normalized = branchMap[branch];
  return normalized || "GS";
};

export const LensStockMatrix = () => {
  const [selectedLensType, setSelectedLensType] = React.useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = React.useState<string>("GS");
  const userProfile = React.useContext(UserProfileContext);
  
  // SPH range (vertical, +4.00 to -8.00)
  const plusSphRange = Array.from({ length: 17 }, (_, i) => (4 - i * 0.25)); // +4.00 to 0
  const minusSphRange = Array.from({ length: 32 }, (_, i) => -(i * 0.25 + 0.25)); // -0.25 to -8.00
  const verticalSphRange = [...plusSphRange, ...minusSphRange];
  
  // CYL range (horizontal, 0 to -2.00)
  const cylRange = Array.from({ length: 9 }, (_, i) => -(i * 0.25)).sort((a, b) => b - a);
  
  // Set initial branch based on user's branch only if not admin
  React.useEffect(() => {
    if (userProfile?.branch && userProfile.role !== 'admin') {
      const normalizedBranch = normalizeBranchName(userProfile.branch);
      setSelectedBranch(normalizedBranch);
    }
  }, [userProfile?.branch, userProfile?.role]);

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['lens-stock', selectedLensType, selectedBranch],
    queryFn: async () => {
      console.log('Fetching stock data with:', {
        lensTypeId: selectedLensType,
        branch: selectedBranch,
        userRole: userProfile?.role,
        userBranch: normalizeBranchName(userProfile?.branch)
      });

      const { data, error } = await supabase
        .from('lens_stock')
        .select('*, lens_type:lens_types(*)')
        .eq('lens_type_id', selectedLensType)
        .eq('branch', selectedBranch);
      
      if (error) {
        console.error('Error fetching stock data:', error);
        throw error;
      }

      console.log('Retrieved stock data:', data);
      
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
            <Select 
              value={selectedBranch} 
              onValueChange={setSelectedBranch}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GS">GS</SelectItem>
                <SelectItem value="KD">KD</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-2 border rounded-md bg-gray-50">
              {selectedBranch}
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
                  <tr 
                    key={sph} 
                    className={sph === 0 ? "bg-gray-100" : undefined}
                  >
                    <td className={`p-2 border font-medium ${
                      sph === 0 
                        ? "text-gray-600" 
                        : sph > 0 
                          ? "text-blue-600" 
                          : "text-purple-600"
                    }`}>
                      {formatNumber(sph)}
                    </td>
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
