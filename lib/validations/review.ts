import { reactionType } from "@prisma/client";
import { z } from "zod";

import { CreateReviewValidatorErrors } from "./errorsEnums";

export type CreateReviewValidatorType = z.infer<typeof CreateReviewValidator>;
export const CreateReviewValidator = z.object({
  bookId: z.string().uuid(),
  text: z
    .string()
    .min(1)
    .max(5000, { message: CreateReviewValidatorErrors.REVIEW_TOO_LONG_5000 })
    .nullable(),
  rate: z
    .number({ required_error: CreateReviewValidatorErrors.WRONG_RATE })
    .min(1, { message: CreateReviewValidatorErrors.WRONG_RATE })
    .max(5, { message: CreateReviewValidatorErrors.WRONG_RATE }),
});

export type DeleteReviewValidatorType = z.infer<typeof DeleteReviewValidator>;
export const DeleteReviewValidator = z.object({
  reviewId: z.string().uuid(),
});

export type ReviewReactionValidatorType = z.infer<
  typeof ReviewReactionValidator
>;
export const ReviewReactionValidator = z.object({
  reviewId: z.string().uuid(),
  reaction: z.enum([reactionType.MEH, reactionType.OK]),
});
