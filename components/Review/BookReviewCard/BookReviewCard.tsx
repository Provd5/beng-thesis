import type { FC } from "react";

import { type GetBookInterface } from "~/types/data/book";
import { type ReviewInterface } from "~/types/data/review";

import { BookCover } from "../../Book/BookCover";
import { LinkToBook } from "../../Links/LinkToBook";
import { BookReviewCardDetails } from "./BookReviewCardDetails";
import { BookReviewCardReactions } from "./BookReviewCardReactions";

interface BookReviewCardProps {
  reviewData: ReviewInterface & { book: GetBookInterface };
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ reviewData }) => {
  return (
    <div>
      <LinkToBook
        bookId={reviewData.book.id}
        bookTitle={reviewData.book.title}
        className="float-left mr-3 h-fit w-fit"
      >
        <BookCover coverUrl={reviewData.book.thumbnail_url} />
      </LinkToBook>
      <div>
        <LinkToBook
          bookId={reviewData.book.id}
          bookTitle={reviewData.book.title}
          className="block w-auto"
        >
          <h1 className="line-clamp-2">{reviewData.book.title}</h1>
          <p className="text-sm text-black-light dark:text-white-dark">
            {reviewData.book.authors.join(", ")}
          </p>
        </LinkToBook>
        <BookReviewCardDetails
          created_at={reviewData.created_at}
          rate={reviewData.rate}
          updated_at={reviewData.updated_at}
        />
        {reviewData.text && (
          <div>
            <p className="py-1 pl-1">{reviewData.text}</p>
            <BookReviewCardReactions reviewId={reviewData.id} />
          </div>
        )}
      </div>
    </div>
  );
};
