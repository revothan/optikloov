import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showStart = Math.max(0, currentPage - 2);
  const showEnd = Math.min(totalPages, currentPage + 3);
  const visiblePages = pages.slice(showStart, showEnd);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showStart > 0 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            className="hover:bg-gray-100"
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
          className={currentPage !== page ? "hover:bg-gray-100" : ""}
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
            className="hover:bg-gray-100"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}