import type { FC } from "react";

import { type ReviewInterface } from "~/types/DataTypes";

import { fetchReviewReactions } from "~/lib/actions/book/fetch";

import { BookCover } from "../Book/BookCover";
import { LinkToBook } from "../Book/LinkToBook";
import { BookReviewCardDetails } from "./BookReviewCardDetails";

interface BookReviewCardProps {
  bookData: BookReviewCardInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = async ({ bookData }) => {
  const myReview = bookData.book.review
    ? (bookData.book.review[0] as ReviewInterface)
    : undefined;
  const { OK } = await fetchReviewReactions(myReview?.id);

  return (
    <div>
      <LinkToBook
        bookId={bookData.book.id}
        bookTitle={bookData.book.title}
        className="float-left mr-3 h-fit w-fit"
      >
        <BookCover coverUrl={bookData.book.thumbnail_url} />
      </LinkToBook>
      <div>
        <LinkToBook
          bookId={bookData.book.id}
          bookTitle={bookData.book.title}
          className="block w-auto"
        >
          <h1 className="line-clamp-2">{bookData.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {bookData.book.authors.join(", ")}
          </p>
        </LinkToBook>
        {myReview && (
          <BookReviewCardDetails
            rate={myReview.rate}
            createdAt={myReview.created_at}
            updatedAt={myReview.updated_at}
            text={myReview.text}
            okReactions={OK}
          />
        )}
      </div>
    </div>
  );
};
