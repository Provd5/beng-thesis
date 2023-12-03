"use client";
import { type FC, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { Button } from "../ui/Buttons";

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef<HTMLButtonElement>(null);

  const allPages = Math.ceil(totalItems / takeLimit);
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;

  useEffect(() => {
    if (currentPageRef.current) {
      currentPageRef.current.scrollIntoView({
        inline: "center",
        behavior: "instant",
      });
    }
  }, [currentPage]);

  const changePage = (pageNumber: number) => {
    if (pageNumber > allPages || pageNumber < 1) return;

    const params = new URLSearchParams(searchParams);

    params.set("page", pageNumber.toString());

    return router.replace(`${pathname}?${params.toString()}`);
  };

  if (!(allPages > 1)) return;

  return (
    <>
      <div className="mt-6 flex flex-col items-end">
        {allPages > 2 && (
          <div className="flex gap-1">
            {currentPage !== 1 && (
              <Button size="sm" onClick={() => changePage(currentPage - 1)}>
                <FaArrowLeft />
              </Button>
            )}
            {currentPage !== allPages && (
              <Button size="sm" onClick={() => changePage(currentPage + 1)}>
                <FaArrowRight />
              </Button>
            )}
          </div>
        )}
        <div
          ref={containerRef}
          className="custom-scrollbar my-3 flex w-fit max-w-full snap-x gap-0.5 overflow-x-auto overflow-y-hidden pb-2 pt-0.5"
        >
          {Array.from({ length: allPages }, (_, i) => (
            <button
              ref={currentPage === i + 1 ? currentPageRef : null}
              key={i + 1}
              disabled={currentPage === i + 1}
              className={clsx(
                "flex h-9 w-10 flex-none snap-center items-center justify-center rounded-sm text-md",
                currentPage === i + 1
                  ? "bg-gradient-dark text-white-light dark:bg-gradient-light"
                  : "border border-secondary text-secondary dark:border-secondary-light dark:text-secondary-light"
              )}
              onClick={() => changePage(i + 1)}
            >
              {(i + 1).toString()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
