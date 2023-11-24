"use client";

import type { FC } from "react";
import { type bookshelfType } from "@prisma/client";

import { bookshelvesOrderByArray } from "~/types/feed/OrderVariants";

import { useFetchData } from "~/hooks/useFetchData";

import { SmallBookCard } from "../Explore/SmallBookCard";
import { SmallBookCardLoader } from "../ui/Loaders/Skeletons/SmallBookCardLoader";

interface CategoryContentCardProps {
  variant: bookshelfType | "OWNED" | "LIKED" | "REVIEWS";
  profileName: string;
  dataLength: number;
}

export const CategoryContentCard: FC<CategoryContentCardProps> = ({
  variant,
  profileName,
  dataLength,
}) => {
  const { fetchedData, isLoading } = useFetchData({
    fetchType: "books",
    takeLimit: 10,
    variant,
    profileName,
    orderBy: bookshelvesOrderByArray[0].sortCategory,
  });
  const booksData = fetchedData as BookCardInterface[];

  return isLoading
    ? Array.from({ length: dataLength }, (_, i) => (
        <SmallBookCardLoader key={i} index={i} />
      ))
    : booksData.map((data) => (
        <SmallBookCard key={data.book.id} book={data.book} />
      ));
};
