"use client";

import type { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type OrderByArrayType } from "~/types/feed/OrderVariants";

import { ModalInitiator } from "../Modals/ModalInitiator";

interface FeedSortProps {
  orderArray: OrderByArrayType;
  searchParams:
    | {
        orderBy?: string;
        order?: "asc" | "desc";
        page?: string;
      }
    | undefined;
}

export const FeedSort: FC<FeedSortProps> = ({ orderArray, searchParams }) => {
  const t = useTranslations("Sorting");

  const pathname = usePathname();
  const router = useRouter();

  const defaultSortCategory = searchParams?.orderBy
    ? searchParams.orderBy
    : orderArray[0].sortCategory;

  const defaultOrder = searchParams?.order
    ? searchParams.order
    : orderArray[0].isSortingByLetters
    ? "asc"
    : "desc";

  const selectOrder = (isSortingByLetters: boolean, sortCategory: string) => {
    const params = new URLSearchParams(searchParams);

    if (defaultSortCategory === sortCategory) {
      params.set("order", defaultOrder !== "asc" ? "asc" : "desc");
      params.set("page", "1");
    } else {
      params.set("order", isSortingByLetters ? "asc" : "desc");
      params.set("orderBy", sortCategory);
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
                {t(defaultSortCategory)}{" "}
                {defaultOrder === "desc" ? (
                  <TbSortDescending2 className="mt-1 text-lg" />
                ) : (
                  <TbSortAscending2 className="mt-1 text-lg" />
                )}
              </span>
            </div>
          }
        >
          <div className="flex flex-col gap-2 whitespace-nowrap text-md">
            {orderArray.map((orderType) => {
              const isActive = defaultSortCategory === orderType.sortCategory;

              return (
                <button
                  key={orderType.sortCategory}
                  className={clsx(
                    "flex items-center justify-between gap-1 py-0.5 text-left",
                    isActive && "text-secondary dark:text-secondary-light"
                  )}
                  onClick={() =>
                    selectOrder(
                      orderType.isSortingByLetters,
                      orderType.sortCategory
                    )
                  }
                >
                  <p>{t(orderType.sortCategory)}</p>
                  {isActive ? (
                    defaultOrder === "desc" ? (
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
