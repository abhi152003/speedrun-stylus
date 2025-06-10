import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type UsersPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export const UsersPagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }: UsersPaginationProps) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex justify-center">
      <div className="join">
        {/* Previous Button */}
        <button className="join-item btn btn-outline" onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev}>
          <ChevronLeftIcon className="w-4 h-4" />
          Previous
        </button>

        {/* First page if not visible */}
        {visiblePages[0] > 1 && (
          <>
            <button className="join-item btn btn-outline" onClick={() => onPageChange(1)}>
              1
            </button>
            {visiblePages[0] > 2 && <span className="join-item btn btn-disabled">...</span>}
          </>
        )}

        {/* Visible pages */}
        {visiblePages.map(page => (
          <button
            key={page}
            className={`join-item btn ${page === currentPage ? "btn-primary" : "btn-outline"}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Last page if not visible */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="join-item btn btn-disabled">...</span>
            )}
            <button className="join-item btn btn-outline" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button className="join-item btn btn-outline" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
          Next
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
