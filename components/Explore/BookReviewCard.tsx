import type { FC } from "react";
import Link from "next/link";

import { type BookReviewCardDataInterface } from "~/types/BookCardDataInterface";

import { BookCover } from "../Book/BookCover";
import { BookReviewCardDetails } from "./BookReviewCardDetails";

interface BookReviewCardProps {
  bookData: BookReviewCardDataInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ bookData }) => {
  const myReview = bookData.review?.[0];
  const okReactions = myReview?.review_reaction.filter(
    ({ reaction }) => reaction === "OK"
  );

  return (
    <div key={bookData.id}>
      <Link
        href={`/book/${bookData.id}/${bookData.title}`}
        className="float-left h-fit w-fit pr-3"
      >
        <BookCover coverUrl={bookData.thumbnail_url} />
      </Link>
      <div>
        <Link
          href={`/book/${bookData.id}/${bookData.title}`}
          className="self-start"
        >
          <h1 className="line-clamp-2">{bookData.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {bookData.authors.join(", ")}
          </p>
        </Link>
        {myReview && (
          <BookReviewCardDetails
            score={myReview.score}
            createdAt={myReview.created_at}
            updatedAt={myReview.updated_at}
            text={myReview.text}
            okReactions={okReactions.length}
          />
        )}
      </div>
    </div>
  );
};
