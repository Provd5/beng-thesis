import type { FC } from "react";

import { type GetBookInterface } from "~/types/data/book";
import { type ReviewInterface } from "~/types/data/review";

import { BookCover } from "../../Book/BookCover";
import { LinkToBook } from "../../Links/LinkToBook";
import { BookReviewCardDetails } from "./BookReviewCardDetails";
import { BookReviewCardReactions } from "./BookReviewCardReactions";

interface BookReviewCardProps {
  reviewData: GetBookInterface & { review: ReviewInterface };
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
          created_at={reviewData.review.created_at}
          rate={reviewData.review.rate}
          updated_at={reviewData.review.updated_at}
        />
        {reviewData.review.text && (
          <div>
            <p className="py-1 pl-1">{reviewData.review.text}</p>
            <BookReviewCardReactions reviewId={reviewData.review.id} />
          </div>
        )}
      </div>
    </div>
  );
};
