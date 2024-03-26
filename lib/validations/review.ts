import { reactionType } from "@prisma/client";
import { z } from "zod";

import { ErrorsToTranslate } from "./errorsEnums";

export type CreateReviewValidatorType = z.infer<typeof CreateReviewValidator>;
export const CreateReviewValidator = z.object({
  text: z
    .string()
    .max(5000, { message: ErrorsToTranslate.REVIEW.REVIEW_IS_TOO_LONG })
    .transform((text) => {
      if (text === "") return null;
      return text;
    })
    .nullish(),
  rate: z
    .number({
      errorMap: () => ({
        message: ErrorsToTranslate.REVIEW.RATE_IS_INVALID,
      }),
    })
    .min(1, { message: ErrorsToTranslate.REVIEW.RATE_IS_INVALID })
    .max(5, { message: ErrorsToTranslate.REVIEW.RATE_IS_INVALID }),
});

export const ReviewReactionValidator = z.enum(
  [reactionType.MEH, reactionType.OK],
  {
    errorMap: () => ({ message: ErrorsToTranslate.DATA_TYPES.DATA_IS_INVALID }),
  }
);
