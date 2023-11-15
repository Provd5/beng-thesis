"use client";

import type { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { type ReviewInterface } from "~/types/DataTypes";

import { hrefToBook } from "~/utils/hrefToBook";

import { BookCover } from "../Book/BookCover";
import { BookReviewCardDetails } from "./BookReviewCardDetails";

interface BookReviewCardProps {
  bookData: BookReviewCardInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ bookData }) => {
  const pathname = usePathname();

  const myReview = bookData.book.review
    ? (bookData.book.review[0] as ReviewInterface)
    : undefined;
  const okReactions = myReview
    ? myReview.review_reaction.filter(({ reaction }) => reaction === "OK")
        .length
    : 0;

  return (
    <div key={bookData.book.id}>
      <Link
        href={hrefToBook(bookData.book.id, bookData.book.title, pathname)}
        className="float-left mr-3 h-fit w-fit"
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </Link>
      <div>
        <Link
          href={hrefToBook(bookData.book.id, bookData.book.title, pathname)}
          className="inline-block w-fit"
        >
          <h1 className="line-clamp-2">{bookData.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {bookData.book.authors.join(", ")}
          </p>
        </Link>
        {myReview && (
          <BookReviewCardDetails
            rate={myReview.rate}
            createdAt={myReview.created_at}
            updatedAt={myReview.updated_at}
            text={myReview.text}
            okReactions={okReactions}
          />
        )}
      </div>
    </div>
  );
};
