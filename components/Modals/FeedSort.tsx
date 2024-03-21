"use client";

import type { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type SortArrayInterface } from "~/types/orderArrays";
import { type SortsType } from "~/types/sort";

import { sortParamsValidator } from "~/utils/sortParamsValidator";

import { ModalInitiator } from "./ModalInitiator";

interface FeedSortProps {
  orderArray: SortArrayInterface<SortsType>[];
}

export const FeedSort: FC<FeedSortProps> = ({ orderArray }) => {
  const t = useTranslations("Sorting");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortParams = sortParamsValidator(searchParams, orderArray);

  const selectOrder = (reverseOrder: boolean, newOrderBy: string) => {
    const params = new URLSearchParams(searchParams);

    if (sortParams.orderBy === newOrderBy) {
      params.set("order", sortParams.order === "desc" ? "asc" : "desc");
      params.set("page", "1");
    } else {
      params.set("order", reverseOrder ? "asc" : "desc");
      params.set("orderBy", newOrderBy);
      params.set("page", "1");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="mb-3 flex w-full justify-end">
        <ModalInitiator
          initiatorStyle={
            <div className="flex items-center gap-1 whitespace-nowrap px-1 py-1 text-sm">
              <span>{t("sort by:")}</span>
              <span className="flex items-center gap-0.5 text-secondary dark:text-secondary-light">
                {t(sortParams.orderBy)}{" "}
                {sortParams.order === "desc" ? (
                  <TbSortDescending2 className="mt-1 text-lg" />
                ) : (
                  <TbSortAscending2 className="mt-1 text-lg" />
                )}
              </span>
            </div>
          }
        >
          <div className="flex flex-col gap-2 whitespace-nowrap text-md">
            {orderArray.map((sort) => {
              const isActive = sortParams.orderBy === sort.orderBy;

              return (
                <button
                  key={sort.orderBy}
                  onClick={() => selectOrder(sort.reverseOrder, sort.orderBy)}
                  className={clsx(
                    "flex items-center justify-between gap-1 py-0.5 text-left",
                    isActive && "text-secondary dark:text-secondary-light"
                  )}
                >
                  <p>{t(sort.orderBy)}</p>
                  {isActive ? (
                    sortParams.order === "desc" ? (
                      <TbSortDescending2 className="h-6 w-6" />
                    ) : (
                      <TbSortAscending2 className="h-6 w-6" />
                    )
                  ) : (
                    <div className="h-6 w-6" />
                  )}
                </button>
              );
            })}
          </div>
        </ModalInitiator>
      </div>
    </>
  );
};
