import type { FC } from "react";

import { getReactions } from "~/lib/services/review";

import { BookReviewCardReactionsLabel } from "./BookReviewCardReactionsLabel";

interface BookReviewCardReactionsProps {
  reviewId: string;
}

export const BookReviewCardReactions: FC<
  BookReviewCardReactionsProps
> = async ({ reviewId }) => {
  const reactions = await getReactions(reviewId);

  if (!(reactions.upQuantity > 0)) return;

  return (
    <p className="text-xs text-colors-text">
      <BookReviewCardReactionsLabel upReactions={reactions.upQuantity} />
    </p>
  );
};
