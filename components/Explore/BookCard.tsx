"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

import { BookCover } from "../Book/BookCover";

interface BookCardProps {
  bookData: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
    review: {
      score: number;
    }[];
    _count: {
      review: number;
      liked_by: number;
    };
  };
}

export const BookCard: FC<BookCardProps> = ({ bookData }) => {
  const t = useTranslations("Book.BookCard");

  return (
    <Link
      href={`/book/${bookData.id}/${bookData.title}`}
      className="flex flex-col gap-1"
    >
      <div className="flex gap-1 xs:gap-2">
        <BookCover coverUrl={bookData.thumbnail_url} />
        <div className="flex flex-col gap-3">
          <div className="leading-tight">
            <h1 className="line-clamp-2">{bookData.title}</h1>
            <h2 className="text-sm font-normal text-black-light dark:text-white-dark">
              {bookData.authors.join(", ")}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm font-normal">
            <div className="flex flex-col">
              <h3 className="bg-gradient-dark bg-clip-text text-base text-transparent dark:bg-gradient-light">
                {t("score")}
              </h3>
              <p className="text-md font-medium">
                {`${arithmeticMeanOfScores(bookData.review)}/5`}
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light">
                {t("likes")}
              </h3>
              <p>{bookData._count.liked_by}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="bg-gradient-dark bg-clip-text text-transparent dark:bg-gradient-light">
                {t("reviews")}
              </h3>
              <p>{bookData._count.review}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
