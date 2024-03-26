import { type FC } from "react";

import { getReactions } from "~/lib/services/review";

import { BookReviewCardReactionsLabel } from "../BookReviewCard/BookReviewCardReactionsLabel";
import { HandleSubmitReaction } from "./HandleSubmitReaction";

interface ManageReactionProps {
  reviewId: string;
}

export const ManageReaction: FC<ManageReactionProps> = async ({ reviewId }) => {
  const reactions = await getReactions(reviewId);

  if (reactions.sessionReaction === undefined)
    return <BookReviewCardReactionsLabel upReactions={reactions.upQuantity} />;

  return (
    <HandleSubmitReaction
      reviewId={reviewId}
      upQuantity={reactions.upQuantity}
      downQuantity={reactions.downQuantity}
      sessionReaction={reactions.sessionReaction}
    />
  );
};
