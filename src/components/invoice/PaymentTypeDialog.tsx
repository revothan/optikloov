import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface PaymentTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentType: string) => void;
}

export function PaymentTypeDialog({ open, onOpenChange, onConfirm }: PaymentTypeDialogProps) {
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");

  const { data: paymentTypes, isLoading } = useQuery({
    queryKey: ["payment-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleConfirm = () => {
    if (selectedPaymentType) {
      onConfirm(selectedPaymentType);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Payment Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedPaymentType}
            onValueChange={setSelectedPaymentType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                paymentTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <div className="flex justify-end">
            <Button
              onClick={handleConfirm}
              disabled={!selectedPaymentType}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}