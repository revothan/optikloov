import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NumericKeypad } from "./NumericKeypad";

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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bottom-0 top-auto translate-y-0">
        <NumericKeypad
          onValue={onValue}
          onClose={onClose}
          allowNegative={allowNegative}
          alwaysPositive={alwaysPositive}
          alwaysNegative={alwaysNegative}
          initialValue={initialValue}
        />
      </DialogContent>
    </Dialog>
  );
}