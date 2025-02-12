
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBranchPrefix } from "@/lib/branch-utils";

interface LensStock {
  id: string;
  quantity: number;
  minimum_stock: number;
  reorder_point: number;
  branch: string;
}

interface StockCellProps {
  stock: LensStock | null | undefined;
  sph: number;
  cyl: number;
  lensTypeId: string;
  branch: string;
}

export const StockCell: React.FC<StockCellProps> = ({ stock, sph, cyl, lensTypeId, branch }) => {
  const quantity = stock?.quantity || 0;
  const minimumStock = stock?.minimum_stock || 2;
  const reorderPoint = stock?.reorder_point || 5;

  const getBackgroundColor = () => {
    if (quantity <= minimumStock) return 'bg-red-100';
    if (quantity <= reorderPoint) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <td className="p-2 border">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${getBackgroundColor()} p-2 rounded text-center`}>
              {quantity}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p>Current Stock: {quantity}</p>
              <p>Minimum Stock: {minimumStock}</p>
              <p>Reorder Point: {reorderPoint}</p>
              <p>Branch: {getBranchPrefix(branch)}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </td>
  );
};
