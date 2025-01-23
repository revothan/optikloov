import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
  const [displayValue, setDisplayValue] = useState("");
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    // Initialize with the provided value
    const cleanValue = initialValue.replace(/[^\d.-]/g, "");
    setDisplayValue(cleanValue.replace("-", ""));
    setIsNegative(cleanValue.startsWith("-"));
  }, [initialValue]);

  const formatValue = (value: string) => {
    // Ensure two decimal places
    const parts = value.split(".");
    if (parts.length === 2) {
      // If there's a decimal part, pad it to 2 places
      parts[1] = parts[1].slice(0, 2).padEnd(2, "0");
    } else {
      // If there's no decimal part, add .00
      parts.push("00");
    }
    return parts.join(".");
  };

  const handleNumberClick = (num: string) => {
    setDisplayValue((prev) => {
      if (num === "." && prev.includes(".")) return prev;
      if (prev === "0" && num !== ".") return num;
      
      let newValue = prev + num;
      const parts = newValue.split(".");
      if (parts.length === 2 && parts[1].length > 2) {
        return prev;
      }
      return newValue;
    });
  };

  const handleDelete = () => {
    setDisplayValue((prev) => {
      const newValue = prev.slice(0, -1);
      return newValue || "0";
    });
  };

  const handleClear = () => {
    setDisplayValue("0");
    setIsNegative(false);
  };

  const toggleSign = () => {
    if (!allowNegative || alwaysPositive || alwaysNegative) return;
    setIsNegative(!isNegative);
  };

  const handleDone = () => {
    let finalValue = formatValue(displayValue || "0");
    
    if (alwaysNegative) {
      finalValue = "-" + finalValue;
    } else if (alwaysPositive) {
      finalValue = finalValue;
    } else {
      finalValue = isNegative ? "-" + finalValue : finalValue;
    }
    
    onValue(finalValue);
    onClose();
  };

  return (
    <div className="bg-background p-4 space-y-4">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg mb-4">
        <span className="text-2xl font-mono">
          {isNegative ? "-" : ""}{displayValue || "0"}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            onClick={() => handleNumberClick(num.toString())}
            className="h-14 text-lg"
          >
            {num}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => handleNumberClick(".")}
          className="h-14 text-lg"
        >
          .
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleNumberClick("0")}
          className="h-14 text-lg"
        >
          0
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleDelete}
          className="h-14"
        >
          ←
        </Button>
        
        <div className="col-span-2">
          {allowNegative && !alwaysPositive && !alwaysNegative && (
            <Button
              type="button"
              variant="outline"
              onClick={toggleSign}
              className="w-full h-14"
            >
              +/-
            </Button>
          )}
        </div>
        
        <Button
          type="button"
          variant="default"
          onClick={handleDone}
          className="h-14"
        >
          Done
        </Button>
      </div>
    </div>
  );
}