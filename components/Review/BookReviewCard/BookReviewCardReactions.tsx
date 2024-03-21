import type { FC } from "react";

import { ReviewService } from "~/lib/services/review";

import { BookReviewCardReactionsLabel } from "./BookReviewCardReactionsLabel";

interface BookReviewCardReactionsProps {
  reviewId: string;
}

export const BookReviewCardReactions: FC<
  BookReviewCardReactionsProps
> = async ({ reviewId }) => {
  const reviewService = new ReviewService();
  const reactions = await reviewService.getReactions(reviewId);

  if (!(reactions.upQuantity > 0)) return;

  return (
    <p className="text-xs text-black-light dark:text-white-dark">
      <BookReviewCardReactionsLabel upReactions={reactions.upQuantity} />
    </p>
  );
};
