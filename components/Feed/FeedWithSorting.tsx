"use client";

import { type FC, useState } from "react";

import {
  bookOrderVariants,
  type BookOrderVariantType,
} from "~/types/feed/orderVariants";

import { BooksFeed } from "./BooksFeed";

interface FeedWithSortingProps {
  variant: "books" | "reviews" | "profiles";
}

export const FeedWithSorting: FC<FeedWithSortingProps> = ({ variant }) => {
  let orderByVariants: BookOrderVariantType[] = [];

  switch (variant) {
    case "books":
      orderByVariants = bookOrderVariants;
      break;

    default:
      break;
  }

  const [orderByState, setOrderByState] = useState(orderByVariants);

  switch (variant) {
    case "books":
      return <BooksFeed orderBy={"authors"} order={"desc"} takeLimit={0} />;

    default:
      break;
  }
};
