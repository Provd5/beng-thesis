"use client";

import { type FC, useState } from "react";

import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

import { type BookOrderVariantType } from "~/types/feed/OrderVariants";

import { type FetchBooksProps } from "~/hooks/feed/useFetchBooks";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { BooksFeed } from "./BooksFeed";

interface FeedWithSortingProps {
  feedVariant: "explore" | "bookshelf" | "reviews" | "profiles";
}

export const FeedWithSorting: FC<FetchBooksProps & FeedWithSortingProps> = ({
  feedVariant,
  takeLimit,
  userId,
  orderBy,
  profileName,
  variant,
}) => {
  const [sortOrderState, setSortOrderState] = useState<"asc" | "desc">("desc");
  const [orderByState, setOrderByState] = useState(orderBy);

  const orderByOptions: BookOrderVariantType[] = [
    "liked_by",
    "review",
    "published_date",
    "title",
    "authors",
    "publisher",
  ];

  const defaultOrderLabel =
    feedVariant === "explore" ? "popularity" : "last_added";

  const selectOrder = (orderType?: BookOrderVariantType) => {
    const isSortingByLetters =
      orderType === "authors" ||
      orderType === "title" ||
      orderType === "publisher";

    if (orderByState === orderType) {
      setSortOrderState(sortOrderState !== "asc" ? "asc" : "desc");
    } else {
      setOrderByState(orderType);
      setSortOrderState(isSortingByLetters ? "asc" : "desc");
    }
  };

  return (
    <>
      <div className="flex w-full justify-end">
        <ModalInitiator
          initiatorStyle={
            <div className="flex items-center gap-1 px-1 py-3">
              <span>{"order:"}</span>
              <span className="flex items-center gap-0.5 text-secondary dark:text-secondary-light">
                {orderByState || defaultOrderLabel}{" "}
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
            <button onClick={() => selectOrder()}>{defaultOrderLabel}</button>
            {orderByOptions.map((orderType) => (
              <button onClick={() => selectOrder(orderType)} key={orderType}>
                {orderType}
              </button>
            ))}
          </div>
        </ModalInitiator>
      </div>
      <BooksFeed
        takeLimit={takeLimit}
        userId={userId}
        order={sortOrderState}
        orderBy={orderByState}
        profileName={profileName}
        variant={variant}
      />
    </>
  );
};
