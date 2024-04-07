import { type FC } from "react";

import { type ReviewReactionInterface } from "~/types/data/review";

import readUserSession from "~/lib/supabase/readUserSession";

import { BookReviewCardReactionsLabel } from "../BookReviewCard/BookReviewCardReactionsLabel";
import { HandleSubmitReaction } from "./HandleSubmitReaction";
import { ReactionsLabel } from "./ReactionsLabel";

interface ManageReactionProps {
  reviewId: string;
  reviewReaction: ReviewReactionInterface[];
}

export const ManageReaction: FC<ManageReactionProps> = async ({
  reviewId,
  reviewReaction,
}) => {
  const {
    data: { session },
  } = await readUserSession();

  const upQuantity = reviewReaction.filter(
    (reaction) => reaction.reaction === "OK"
  ).length;
  const downQuantity = reviewReaction.filter(
    (reaction) => reaction.reaction === "MEH"
  ).length;
  const sessionReaction = session
    ? reviewReaction.find((reaction) => reaction.user_id === session?.user.id)
        ?.reaction || null
    : undefined;

  return (
    <div className="mt-3 flex w-full flex-col items-end justify-end gap-2">
      {sessionReaction === undefined ? (
        <BookReviewCardReactionsLabel upReactions={upQuantity} />
      ) : (
        <>
          <ReactionsLabel />
          <HandleSubmitReaction
            reviewId={reviewId}
            upQuantity={upQuantity}
            downQuantity={downQuantity}
            sessionReaction={sessionReaction}
          />
        </>
      )}
    </div>
  );
};
