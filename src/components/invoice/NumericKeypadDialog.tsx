import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NumericKeypadDialogProps {
  open: boolean;
  onClose: () => void;
  onValue: (value: string) => void;
  allowNegative?: boolean;
  alwaysPositive?: boolean;
  alwaysNegative?: boolean;
  initialValue?: string;
}

export function NumericKeypadDialog({
  open,
  onClose,
  onValue,
  allowNegative = false,
  alwaysPositive = false,
  alwaysNegative = false,
  initialValue = "",
}: NumericKeypadDialogProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const handleNumberClick = (num: string) => {
    let newValue = initialValue + num;
    if (initialValue === "0" && num !== ".") {
      newValue = num;
    }
    
    // Ensure only 2 decimal places
    if (initialValue.includes(".")) {
      const [whole, decimal] = newValue.split(".");
      if (decimal && decimal.length > 2) return;
    }
    
    onValue(newValue);
  };

  const handleDelete = () => {
    const newValue = initialValue.slice(0, -1) || "0";
    onValue(newValue);
  };

  const toggleSign = () => {
    if (alwaysPositive || alwaysNegative) return;
    if (allowNegative) {
      const newValue = initialValue.startsWith("-") 
        ? initialValue.slice(1) 
        : `-${initialValue}`;
      onValue(newValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bottom-0 top-auto translate-y-0">
        <div className="grid grid-cols-3 gap-1 p-2 bg-background">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              type="button"
              variant="outline"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNumberClick(".")}
          >
            .
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleNumberClick("0")}
          >
            0
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
          >
            ←
          </Button>
          {allowNegative && !alwaysPositive && !alwaysNegative && (
            <Button
              type="button"
              variant="outline"
              onClick={toggleSign}
              className="col-span-2"
            >
              +/-
            </Button>
          )}
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            className={allowNegative ? "" : "col-span-2"}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}