import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("grid")}
        className={view !== "grid" ? "hover:bg-gray-100" : ""}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => setView("list")}
        className={view !== "list" ? "hover:bg-gray-100" : ""}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}