import { type FC } from "react";

import { type BookshelfReviewsInterface } from "~/types/data/bookshelf";

import ROUTES from "~/utils/routes";

import { BookCover } from "../../Book/BookCover";
import { LinkWithFrom } from "../../Links/LinkToBook";
import { BookReviewCardDetails } from "./BookReviewCardDetails";
import { BookReviewCardReactions } from "./BookReviewCardReactions";

interface BookReviewCardProps {
  reviewData: BookshelfReviewsInterface;
}

export const BookReviewCard: FC<BookReviewCardProps> = ({ reviewData }) => {
  return (
    <LinkWithFrom
      href={ROUTES.book.root(reviewData.book.id, reviewData.book.title)}
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
          <BookReviewCardReactions
            reviewReactions={reviewData.review_reaction}
          />
        )}
        {reviewData.review.text && (
          <p className="mt-1 py-1 pl-1">{reviewData.review.text}</p>
        )}
      </div>
    </LinkWithFrom>
  );
};
