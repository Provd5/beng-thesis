"use client";

import { type FC, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type SortArrayInterface } from "~/types/orderArrays";
import { type SortsType } from "~/types/sort";

import { cn } from "~/utils/cn";
import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { LargeComponentLoader } from "../ui/Loaders/Loader";
import { Pagination } from "../ui/Pagination/Pagination";
import { ModalInitiator } from "./ModalInitiator";

interface FeedSortProps {
  currentPage: number;
  totalPages: number;
  children: React.ReactNode;
  orderArray: SortArrayInterface<SortsType>[];
}

export const FeedSort: FC<FeedSortProps> = ({
  currentPage,
  totalPages,
  children,
  orderArray,
}) => {
  const t = useTranslations("Sorting");

  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortParams = sortParamsValidator(searchParams, orderArray);

  const selectOrder = (reverseOrder: boolean, newOrderBy: string) => {
    const params = new URLSearchParams(searchParams);

    if (sortParams.orderBy === newOrderBy) {
      params.set("order", sortParams.order === "desc" ? "asc" : "desc");
    } else {
      params.set("order", reverseOrder ? "asc" : "desc");
      params.set("orderBy", newOrderBy);
    }

    if (params.has("page")) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <div className="mb-3 flex w-full justify-end">
        <ModalInitiator
          initiatorStyle={
            <div className="flex items-center gap-1 whitespace-nowrap px-1 py-1 text-sm">
              <span>{t("sort by:")}</span>
              <span className="flex items-center gap-0.5 text-colors-primary hover:animate-pulse">
                {t(sortParams.orderBy)}{" "}
                {sortParams.order === "desc" ? (
                  <TbSortDescending2 className="text-lg" />
                ) : (
                  <TbSortAscending2 className="text-lg" />
                )}
              </span>
            </div>
          }
        >
          <div className="text-md flex flex-col gap-2 whitespace-nowrap">
            {orderArray.map((sort) => {
              const isActive = sortParams.orderBy === sort.orderBy;

              return (
                <button
                  key={sort.orderBy}
                  onClick={() => selectOrder(sort.reverseOrder, sort.orderBy)}
                  className={cn(
                    "flex items-center justify-between gap-1 py-0.5 text-left transition-transform",
                    isActive && "text-colors-primary",
                    !isActive && "hover:translate-x-1"
                  )}
                >
                  <p>{t(sort.orderBy)}</p>
                  {isActive ? (
                    sortParams.order === "desc" ? (
                      <TbSortDescending2 className="size-6" />
                    ) : (
                      <TbSortAscending2 className="size-6" />
                    )
                  ) : (
                    <div className="size-6" />
                  )}
                </button>
              );
            })}
          </div>
        </ModalInitiator>
      </div>
      {isPending ? <LargeComponentLoader /> : children}

      {!isPending && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          startTransition={startTransition}
        />
      )}
    </div>
  );
};
