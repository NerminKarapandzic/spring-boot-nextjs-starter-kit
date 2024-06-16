"use client";

import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface AppPaginationProps {
  onNextPage: () => void;
  onPreviousPage: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}
export default function AppPagination({
  onNextPage,
  onPreviousPage,
  hasNext,
  hasPrevious,
}: AppPaginationProps) {
  const goToNextPage = () => {
    if (hasNext) onNextPage();
  };

  const goToPreviousPage = () => {
    if (hasPrevious) onPreviousPage();
  };

  return (
    <Pagination className="justify-end mt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              "cursor-pointer",
              !hasPrevious && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToPreviousPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className={cn(
              "cursor-pointer",
              !hasNext && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
