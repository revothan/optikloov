
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean; // Add disabled prop
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false, // Add default value
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce(value, 300);

  // Keep focus after search updates
  useEffect(() => {
    const shouldFocus = document.activeElement === inputRef.current;
    if (shouldFocus) {
      const cursorPosition = inputRef.current?.selectionStart || 0;
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
        disabled={disabled}
        autoFocus
      />
    </div>
  );
}
