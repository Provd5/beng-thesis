"use client";

import { type FC } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
  totalItems: number;
  takeLimit: number;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
}

export const Pagination: FC<PaginationProps> = ({
  totalItems,
  takeLimit,
  searchParams,
}) => {
  const pathname = usePathname();

  const allPages = Math.ceil(totalItems / takeLimit);
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;

  const changePage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber <= allPages && pageNumber >= 1) {
      params.set("page", pageNumber.toString());
    }

    return `${pathname}?${params.toString()}`;
  };

  const commonClass = (i: number) =>
    clsx(
      "flex h-9 w-10 flex-none items-center justify-center rounded-sm text-md",
      currentPage === i + 1
        ? "bg-gradient-dark text-white-light dark:bg-gradient-light"
        : "border border-secondary text-secondary dark:border-secondary-light dark:text-secondary-light"
    );

  return (
    <>
      {allPages > 1 && (
        <div className="mt-6 flex flex-col items-end">
          {allPages > 2 && (
            <div className="flex gap-1">
              {currentPage !== 1 && (
                <a
                  href={changePage(currentPage - 1)}
                  className={commonClass(currentPage - 1)}
                >
                  <FaArrowLeft />
                </a>
              )}
              {currentPage !== allPages && (
                <a
                  href={changePage(currentPage + 1)}
                  className={commonClass(currentPage - 1)}
                >
                  <FaArrowRight />
                </a>
              )}
            </div>
          )}
          <div className="custom-scrollbar my-3 flex w-full max-w-md gap-0.5 overflow-x-auto overflow-y-hidden pb-2 pt-0.5">
            {Array.from({ length: allPages }, (_, i) => (
              <a
                href={changePage(i + 1)}
                key={i + 1}
                tabIndex={currentPage === i + 1 ? -1 : 0}
                className={clsx(
                  currentPage === i + 1 && "pointer-events-none",
                  commonClass(i)
                )}
              >
                {(i + 1).toString()}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
