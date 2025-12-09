"use client"; // Required for using hooks like usePathname and useSearchParams

import { FC, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing"; // Your custom Link component
import twFocusClass from "@/utils/twFocusClass";

export interface PaginationProps {
  currentPage?: number;
  totalPages: number;
  className?: string;
}

const Pagination: FC<PaginationProps> = ({
  currentPage = 1, // It's safer to provide a default value
  totalPages,
  className = "",
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create the URL for a specific page, preserving existing search parameters
  const createPageURL = useCallback(
    (page: number) => {
      // Create a mutable copy of the current search parameters
      const newSearchParams = new URLSearchParams(searchParams);
      // Set or update the 'page' parameter
      newSearchParams.set("page", page.toString());

      // Return the full path with the updated query string
      return `${pathname}?${newSearchParams.toString()}`;
    },
    [pathname, searchParams], // Dependency array for useCallback
  );

  // No need for a separate renderItem function, mapping directly is cleaner
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  return (
    <nav
      className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}
      aria-label="Pagination"
    >
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        // Render the active/current page item as a non-clickable span
        if (page === currentPage) {
          return (
            <span
              key={page}
              className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`}
              aria-current="page" // Accessibility: indicates the current page
            >
              {page}
            </span>
          );
        }

        // Render other page items as clickable links
        return (
          <Link
            href={createPageURL(page)}
            key={page}
            className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
            aria-label={`Go to page ${page}`} // Accessibility: clear link purpose
          >
            {page}
          </Link>
        );
      })}
    </nav>
  );
};

export default Pagination;
