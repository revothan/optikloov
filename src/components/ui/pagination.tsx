
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean; // Add disabled prop
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false, // Add default value
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showStart = Math.max(0, currentPage - 2);
  const showEnd = Math.min(totalPages, currentPage + 3);
  const visiblePages = pages.slice(showStart, showEnd);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showStart > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={disabled}
          >
            1
          </Button>
          {showStart > 1 && <span className="text-gray-500">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          disabled={disabled}
        >
          {page}
        </Button>
      ))}

      {showEnd < totalPages && (
        <>
          {showEnd < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={disabled}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
