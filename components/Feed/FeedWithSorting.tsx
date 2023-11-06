"use client";

import React, { type FC, useState } from "react";
import { type bookshelfType } from "@prisma/client";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type OrderByArrayType } from "~/types/feed/OrderVariants";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { BooksFeed } from "./BooksFeed";
import { ReviewsFeed } from "./ReviewsFeed";

interface CommonProps {
  orderArray: OrderByArrayType;
  takeLimit: number;
}

interface BooksFeedProps extends CommonProps {
  feedVariant: "books";
  variant?: bookshelfType | "OWNED" | "LIKED" | "REVIEWS";
  userId?: string;
  profileName?: string;
  bookId?: never;
}

interface ReviewsFeedProps extends CommonProps {
  feedVariant: "reviews";
  bookId: string;
  userId?: string;
  variant?: never;
  profileName?: never;
}

interface ProfilesFeedProps extends CommonProps {
  feedVariant: "profiles";
  userId: string;
  variant?: never;
  profileName?: never;
  bookId?: never;
}

export const FeedWithSorting: FC<
  BooksFeedProps | ReviewsFeedProps | ProfilesFeedProps
> = ({
  feedVariant,
  orderArray,
  takeLimit,
  variant,
  userId,
  profileName,
  bookId,
}) => {
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
              <span>{"order:"}</span>
              <span className="flex items-center gap-0.5 text-secondary dark:text-secondary-light">
                {orderByState}{" "}
                {sortOrderState === "desc" ? (
                  <TbSortDescending2 className="mt-1 text-lg" />
                ) : (
                  <TbSortAscending2 className="mt-1 text-lg" />
                )}
              </span>
            </div>
          }
        >
          <div className="flex flex-col">
            {orderArray.map((orderType) => (
              <button
                onClick={() =>
                  selectOrder(
                    orderType.isSortingByLetters,
                    orderType.sortCategory
                  )
                }
                key={orderType.sortCategory}
              >
                {orderType.sortCategory}
              </button>
            ))}
          </div>
        </ModalInitiator>
      </div>
      {feedVariant === "books" && (
        <BooksFeed
          takeLimit={takeLimit}
          userId={userId}
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
          bookId={bookId}
          userId={userId}
          order={sortOrderState}
          orderBy={
            orderByState === defaultSortCategory ? undefined : orderByState
          }
        />
      )}
    </>
  );
};
