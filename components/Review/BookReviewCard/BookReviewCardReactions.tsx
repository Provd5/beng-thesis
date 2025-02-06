import type { FC } from "react";

import { type BookshelfReviewsInterface } from "~/types/data/bookshelf";

import { BookReviewCardReactionsLabel } from "./BookReviewCardReactionsLabel";

interface BookReviewCardReactionsProps {
  reviewReactions: BookshelfReviewsInterface["review_reaction"];
}

export const BookReviewCardReactions: FC<
  BookReviewCardReactionsProps
> = async ({ reviewReactions }) => {
  const upQuantity = reviewReactions?.filter((r) => r.reaction === "OK").length;
  if (!(upQuantity > 0)) return;

  return (
    <div className="text-xs text-colors-text">
      <BookReviewCardReactionsLabel upReactions={upQuantity} />
    </div>
  );
};
