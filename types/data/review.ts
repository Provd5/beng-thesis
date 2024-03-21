import { type reactionType } from "@prisma/client";

export const HIGHEST_REVIEW_RATE = 5;
export const ReviewRatesArray = [1, 2, 3, 4, 5];

export interface ReviewInterface {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  text: string | null;
  author_id: string;
  book_id: string;
  rate: number;
}

export interface GetReviewReactionInterface {
  upQuantity: number;
  downQuantity: number;
  sessionReaction: reactionType | null | undefined;
}

export interface ReviewReactionInterface {
  user_id: string;
  review_id: string;
  reaction: reactionType;
}
