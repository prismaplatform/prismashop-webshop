import { FC } from "react";
import twFocusClass from "@/utils/twFocusClass";
import { Link, usePathname } from "@/i18n/routing"; // Or "next-intl/client"
import { useSearchParams } from "next/navigation";

export interface PaginationProps {
  currentPage?: number;
  totalPages: number;
  className?: string;
}

const DOTS = "...";

const Pagination: FC<PaginationProps> = ({
  currentPage = 1,
  totalPages,
  className = "",
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper to create the URL for a specific page, preserving existing search params
  const createPageURL = (page: number | string) => {
    // Start with current search params to preserve filters
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", String(page));

    return {
      pathname: pathname,
      search: newSearchParams.toString(),
    };
  };

  /**
   * Generates a more advanced pagination range with ellipses.
   * e.g., [1, '...', 5, 6, 7, '...', 12]
   */
  const getPaginationRange = (): (string | number)[] => {
    // Siblings are the number of pages to show on each side of the current page
    const siblingCount = 1;
    // Total page numbers to display: 1 (first) + 1 (last) + current + 2*siblings + 2 (ellipses)
    const totalPageNumbers = siblingCount + 5;

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but right dots are needed
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots to show, but left dots are needed
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots are needed
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return []; // Should be unreachable
  };

  const pages = getPaginationRange();

  // If there's only one page, don't render the pagination component
  if (currentPage === 0 || totalPages <= 1) {
    return null;
  }

  const renderPageLink = (page: number | string, index: number) => {
    // Render ellipsis as a non-interactive element
    if (typeof page === "string") {
      return (
        <span
          key={`${page}-${index}`}
          className="inline-flex w-11 h-11 items-center justify-center text-neutral-500"
        >
          {DOTS}
        </span>
      );
    }

    // Render the currently active page
    if (page === currentPage) {
      return (
        <span
          key={page}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}
        >
          {page}
        </span>
      );
    }

    // Render a link to another page
    return (
      <Link
        href={createPageURL(page)}
        key={page}
        className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
      >
        {page}
      </Link>
    );
  };

  const renderControl = (label: string, page: number, disabled: boolean) => {
    const commonClasses =
      "inline-flex w-11 h-11 items-center justify-center rounded-full";
    if (disabled) {
      return (
        <span
          className={`${commonClasses} text-neutral-400 cursor-not-allowed`}
        >
          {label}
        </span>
      );
    }

    return (
      <Link
        href={createPageURL(page)}
        className={`${commonClasses} bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      className={`nc-Pagination inline-flex justify-center space-x-1 text-base font-medium ${className}`}
      aria-label="Pagination"
    >
      {renderControl("<", currentPage - 1, currentPage <= 1)}
      {pages.map(renderPageLink)}
      {renderControl(">", currentPage + 1, currentPage >= totalPages)}
    </nav>
  );
};

export default Pagination;
