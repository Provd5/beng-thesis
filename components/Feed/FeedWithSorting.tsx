"use client";

import React, { type FC, useState } from "react";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type OrderByArrayType } from "~/types/feed/OrderVariants";

import { type FetchBooksProps } from "~/hooks/feed/useFetchBooks";
import { type FetchProfilesProps } from "~/hooks/feed/useFetchProfiles";
import { type FetchReviewsProps } from "~/hooks/feed/useFetchReviews";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { BooksFeed } from "./BooksFeed";
import { ProfilesFeed } from "./ProfilesFeed";
import { ReviewsFeed } from "./ReviewsFeed";

interface BooksFeedProps extends FetchBooksProps {
  feedVariant: "books";
  orderArray: OrderByArrayType;
  bookId?: never;
  userId?: never;
}

interface ReviewsFeedProps extends FetchReviewsProps {
  feedVariant: "reviews";
  orderArray: OrderByArrayType;
  variant?: never;
  profileName?: never;
}

interface ProfilesFeedProps extends FetchProfilesProps {
  feedVariant: "profiles";
  orderArray: OrderByArrayType;
  bookId?: never;
  profileName?: never;
}

export const FeedWithSorting: FC<
  BooksFeedProps | ReviewsFeedProps | ProfilesFeedProps
> = ({
  feedVariant,
  orderArray,
  takeLimit,
  variant,
  userId,
  sessionId,
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
          sessionId={sessionId}
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
          userId={undefined}
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
