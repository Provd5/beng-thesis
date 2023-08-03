import { z } from "zod";

import { CreateReviewValidatorErrors } from "../errorsEnums";

export const CreateReviewValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    text: z
      .string()
      .nonempty({ message: CreateReviewValidatorErrors.REVIEW_REQUIRED })
      .max(5000, { message: CreateReviewValidatorErrors.REVIEW_TOO_LONG_5000 }),
    score: z
      .number({ required_error: CreateReviewValidatorErrors.WRONG_SCORE })
      .min(1, { message: CreateReviewValidatorErrors.WRONG_SCORE })
      .max(5, { message: CreateReviewValidatorErrors.WRONG_SCORE }),
  }),
});
