import { type FC, Suspense } from "react";

import { type GetBookInterface } from "~/types/data/book";
import { type ReviewInterface } from "~/types/data/review";

import { Loader } from "~/components/ui/Loaders/Loader";

import { BookCover } from "../../Book/BookCover";
import { LinkToBook } from "../../Links/LinkToBook";
import { BookReviewCardDetails } from "./BookReviewCardDetails";
import { BookReviewCardReactions } from "./BookReviewCardReactions";

interface BookReviewCardProps {
  reviewData: GetBookInterface & { review: ReviewInterface };
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ reviewData }) => {
  return (
    <LinkToBook
      bookId={reviewData.book.id}
      bookTitle={reviewData.book.title}
      className="rounded-lg bg-white p-2 dark:bg-black"
    >
      <div className="float-left mr-3 size-fit">
        <BookCover coverUrl={reviewData.book.thumbnail_url} />
      </div>
      <div>
        <h1 className="line-clamp-2">{reviewData.book.title}</h1>
        <p className="text-sm text-colors-text">
          {reviewData.book.authors.join(", ")}
        </p>
        <BookReviewCardDetails
          created_at={reviewData.review.created_at}
          rate={reviewData.review.rate}
          updated_at={reviewData.review.updated_at}
        />
        {reviewData.review.text && (
          <Suspense key={"BookReviewCardReactions"} fallback={<Loader />}>
            <BookReviewCardReactions reviewId={reviewData.review.id} />
          </Suspense>
        )}
        {reviewData.review.text && (
          <p className="mt-1 py-1 pl-1">{reviewData.review.text}</p>
        )}
      </div>
    </LinkToBook>
  );
};
