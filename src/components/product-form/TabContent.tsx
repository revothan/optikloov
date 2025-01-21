import { ReactNode } from "react";

interface TabContentProps {
  children: ReactNode;
}

export function TabContent({ children }: TabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}