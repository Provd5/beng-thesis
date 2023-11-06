import type { FC } from "react";
import Link from "next/link";

import { type ReviewInterface } from "~/types/DataTypes";

import { BookCover } from "../Book/BookCover";
import { BookReviewCardDetails } from "./BookReviewCardDetails";

interface BookReviewCardProps {
  bookData: BookReviewCardInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ bookData }) => {
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
        href={`/book/${bookData.book.id}/${bookData.book.title}`}
        className="float-left h-fit w-fit pr-3"
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </Link>
      <div>
        <Link
          href={`/book/${bookData.book.id}/${bookData.book.title}`}
          className="self-start"
        >
          <h1 className="line-clamp-2">{bookData.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {bookData.book.authors.join(", ")}
          </p>
        </Link>
        {myReview && (
          <BookReviewCardDetails
            score={myReview.score}
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
