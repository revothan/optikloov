import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LensTypeSelect } from "./LensTypeSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StockUpdateDialogProps {
  lensTypeId: string | null;
}

export const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({ lensTypeId }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedLensType, setSelectedLensType] = React.useState<string | null>(lensTypeId);
  const queryClient = useQueryClient();

  const handleStockUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase.from('lens_stock').upsert({
        lens_type_id: selectedLensType,
        sph: parseFloat(formData.get('sph') as string),
        cyl: parseFloat(formData.get('cyl') as string),
        quantity: parseInt(formData.get('quantity') as string),
        minimum_stock: parseInt(formData.get('minimum_stock') as string),
        reorder_point: parseInt(formData.get('reorder_point') as string),
      });

      if (error) throw error;

      toast.success('Stock updated successfully');
      queryClient.invalidateQueries({ queryKey: ['lens-stock'] });
      setOpen(false);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleCreateLensType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Insert as array with single object
      const { data, error } = await supabase
        .from('lens_types')
        .insert([{
          name: formData.get('name') as string,
          material: formData.get('material') as string,
          index: parseFloat(formData.get('index') as string),
          description: formData.get('description') as string,
          price: parseFloat(formData.get('price') as string) || 0,
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Lens type created successfully');
      queryClient.invalidateQueries({ queryKey: ['lens-types'] });
      setSelectedLensType(data.id);
    } catch (error) {
      console.error('Error creating lens type:', error);
      toast.error('Failed to create lens type');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Update Stock</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Lens Stock</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="update" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="update">Update Stock</TabsTrigger>
            <TabsTrigger value="create">Create Lens Type</TabsTrigger>
          </TabsList>
          
          <TabsContent value="update">
            <form onSubmit={handleStockUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Lens Type</Label>
                <LensTypeSelect 
                  value={selectedLensType} 
                  onChange={setSelectedLensType}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sph">SPH</Label>
                  <Input
                    id="sph"
                    name="sph"
                    type="number"
                    step="0.25"
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cyl">CYL</Label>
                  <Input
                    id="cyl"
                    name="cyl"
                    type="number"
                    step="0.25"
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  required
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum_stock">Minimum Stock</Label>
                  <Input
                    id="minimum_stock"
                    name="minimum_stock"
                    type="number"
                    required
                    defaultValue="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder_point">Reorder Point</Label>
                  <Input
                    id="reorder_point"
                    name="reorder_point"
                    type="number"
                    required
                    defaultValue="5"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Save Stock</Button>
            </form>
          </TabsContent>

          <TabsContent value="create">
            <form onSubmit={handleCreateLensType} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Single Vision CR39"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  required
                  placeholder="e.g., CR39"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="index">Index</Label>
                <Input
                  id="index"
                  name="index"
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g., 1.56"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  required
                  placeholder="Enter price"
                  defaultValue="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Optional description"
                />
              </div>
              <Button type="submit" className="w-full">Create Lens Type</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};