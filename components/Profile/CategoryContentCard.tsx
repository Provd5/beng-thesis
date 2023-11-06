"use client";

import type { FC } from "react";
import { type bookshelfType } from "@prisma/client";

import { useFetchBooks } from "~/hooks/feed/useFetchBooks";

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
  const { fetchedData, isLoading } = useFetchBooks({
    takeLimit: 10,
    variant,
    sessionId: undefined,
    profileName,
  });

  return isLoading
    ? Array.from({ length: dataLength }, (_, i) => (
        <SmallBookCardLoader key={i} />
      ))
    : (fetchedData as BookCardInterface[]).map((data) => (
        <SmallBookCard key={data.book.id} book={data.book} />
      ));
};
