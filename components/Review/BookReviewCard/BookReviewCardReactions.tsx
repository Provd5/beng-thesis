import type { FC } from "react";

import { getReactions } from "~/lib/services/review/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { BookReviewCardReactionsLabel } from "./BookReviewCardReactionsLabel";

interface BookReviewCardReactionsProps {
  reviewId: string;
}

export const BookReviewCardReactions: FC<
  BookReviewCardReactionsProps
> = async ({ reviewId }) => {
  const sessionUser = await getSessionUser();
  const reactions = await getReactions(sessionUser?.id, reviewId);

  if (!(reactions.upQuantity > 0)) return;

  return (
    <div className="text-xs text-colors-text">
      <BookReviewCardReactionsLabel upReactions={reactions.upQuantity} />
    </div>
  );
};
