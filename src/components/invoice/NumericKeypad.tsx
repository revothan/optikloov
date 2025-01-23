import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NumericKeypadProps {
  onValue: (value: string) => void;
  onClose: () => void;
  allowNegative?: boolean;
  alwaysPositive?: boolean;
  alwaysNegative?: boolean;
  initialValue?: string;
}

export function NumericKeypad({
  onValue,
  onClose,
  allowNegative = false,
  alwaysPositive = false,
  alwaysNegative = false,
  initialValue = "",
}: NumericKeypadProps) {
  const [value, setValue] = useState(initialValue);
  const [isNegative, setIsNegative] = useState(
    alwaysNegative || (initialValue.startsWith("-") && allowNegative)
  );

  const handleNumberClick = (num: string) => {
    if (value.includes(".") && num === ".") return;
    
    let newValue = value + num;
    if (value === "0" && num !== ".") {
      newValue = num;
    }
    
    // Ensure only 2 decimal places
    if (value.includes(".")) {
      const [whole, decimal] = newValue.split(".");
      if (decimal && decimal.length > 2) return;
    }
    
    setValue(newValue);
    const finalValue = isNegative ? `-${newValue}` : newValue;
    onValue(alwaysPositive ? newValue : alwaysNegative ? `-${newValue}` : finalValue);
  };

  const handleDelete = () => {
    const newValue = value.slice(0, -1);
    setValue(newValue || "0");
    const finalValue = isNegative ? `-${newValue}` : newValue;
    onValue(alwaysPositive ? newValue : alwaysNegative ? `-${newValue}` : finalValue);
  };

  const toggleSign = () => {
    if (alwaysPositive || alwaysNegative) return;
    if (allowNegative) {
      setIsNegative(!isNegative);
      onValue(isNegative ? value : `-${value}`);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-background border-t z-50">
      <div className="grid grid-cols-3 gap-1 p-2">
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
    </div>
  );
}