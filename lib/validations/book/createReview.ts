import { z } from "zod";

import { CreateReviewValidatorErrors } from "../errorsEnums";

export const CreateReviewValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    text: z
      .string()
      .nonempty()
      .max(5000, { message: CreateReviewValidatorErrors.REVIEW_TOO_LONG_5000 })
      .nullable(),
    rate: z
      .number({ required_error: CreateReviewValidatorErrors.WRONG_RATE })
      .min(1, { message: CreateReviewValidatorErrors.WRONG_RATE })
      .max(5, { message: CreateReviewValidatorErrors.WRONG_RATE }),
  }),
});
