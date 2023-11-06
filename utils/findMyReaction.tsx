import { type reactionType } from "@prisma/client";

import { type ReactionTypeInterface } from "~/types/DataTypes";

export const findMyReaction = (
  review_reaction: ReactionTypeInterface[],
  userId: string | undefined
): reactionType | undefined => {
  return review_reaction.find((reaction) => reaction.user_id === userId)
    ?.reaction;
};
