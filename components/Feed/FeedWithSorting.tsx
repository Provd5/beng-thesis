"use client";

import React, { type FC, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import {
  type FetchBooksProps,
  type FetchProfilesProps,
  type FetchReviewsProps,
} from "~/types/feed/FetchProps";
import { type OrderByArrayType } from "~/types/feed/OrderVariants";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { BooksFeed } from "./BooksFeed";
import { ProfilesFeed } from "./ProfilesFeed";
import { ReviewsFeed } from "./ReviewsFeed";

interface BooksFeedProps extends FetchBooksProps {
  feedVariant: "books";
  orderArray: OrderByArrayType;
}

interface ReviewsFeedProps extends FetchReviewsProps {
  feedVariant: "reviews";
  orderArray: OrderByArrayType;
}

interface ProfilesFeedProps extends FetchProfilesProps {
  feedVariant: "profiles";
  orderArray: OrderByArrayType;
}

export const FeedWithSorting: FC<
  (BooksFeedProps | ReviewsFeedProps | ProfilesFeedProps) & {
    sessionId?: string;
  }
> = ({
  feedVariant,
  orderArray,
  takeLimit,
  variant,
  userId,
  profileName,
  bookId,
  sessionId,
}) => {
  const t = useTranslations("Sorting");

  const defaultSortCategory = orderArray[0].sortCategory;

  const [sortOrderState, setSortOrderState] = useState<"asc" | "desc">("desc");
  const [orderByState, setOrderByState] = useState<string>(defaultSortCategory);

  const selectOrder = (isSortingByLetters: boolean, sortCategory: string) => {
    if (orderByState === sortCategory) {
      setSortOrderState(sortOrderState !== "asc" ? "asc" : "desc"),
        setOrderByState(orderByState);
    } else {
      setSortOrderState(isSortingByLetters ? "asc" : "desc"),
        setOrderByState(sortCategory);
    }
  };

  return (
    <>
      <div className="mb-3 flex w-full justify-end">
        <ModalInitiator
          initiatorStyle={
            <div className="flex items-center gap-1 px-1 py-1">
              <span>{t("sort by:")}</span>
              <span className="flex items-center gap-0.5 text-secondary dark:text-secondary-light">
                {t(orderByState)}{" "}
                {sortOrderState === "desc" ? (
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
              const isActive = orderByState === orderType.sortCategory;

              return (
                <button
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
                  key={orderType.sortCategory}
                >
                  <p>{t(orderType.sortCategory)}</p>
                  {isActive ? (
                    sortOrderState === "desc" ? (
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
      {feedVariant === "books" && (
        <BooksFeed
          takeLimit={takeLimit}
          profileName={profileName}
          variant={variant}
          order={sortOrderState}
          orderBy={
            orderByState === defaultSortCategory ? undefined : orderByState
          }
        />
      )}
      {feedVariant === "reviews" && (
        <ReviewsFeed
          takeLimit={takeLimit}
          isMyReview={false}
          bookId={bookId}
          sessionId={sessionId}
          order={sortOrderState}
          orderBy={
            orderByState === defaultSortCategory ? undefined : orderByState
          }
        />
      )}
      {feedVariant === "profiles" &&
        (variant && userId ? (
          <ProfilesFeed
            takeLimit={takeLimit}
            variant={variant}
            userId={userId}
            sessionId={sessionId}
            order={sortOrderState}
            orderBy={
              orderByState === defaultSortCategory ? undefined : orderByState
            }
          />
        ) : (
          <ProfilesFeed
            takeLimit={takeLimit}
            variant={undefined}
            userId={undefined}
            sessionId={sessionId}
            order={sortOrderState}
            orderBy={
              orderByState === defaultSortCategory ? undefined : orderByState
            }
          />
        ))}
    </>
  );
};
