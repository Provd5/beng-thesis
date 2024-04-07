import { z } from "zod";

import { BookshelfArray } from "~/types/consts";

import { ErrorsToTranslate } from "./errorsEnums";

export type ChangeBookshelfValidatorType = z.infer<
  typeof ChangeBookshelfValidator
>;
export const ChangeBookshelfValidator = z.object({
  bookshelf: z
    .enum(BookshelfArray, {
      errorMap: () => ({
        message: ErrorsToTranslate.DATA_TYPES.DATA_IS_INVALID,
      }),
    })
    .nullable(),
  began_reading_at: z
    .date({
      errorMap: () => ({
        message: ErrorsToTranslate.DATA_TYPES.DATE_IS_INVALID,
      }),
    })
    .nullish(),
  updated_at: z.date({
    errorMap: () => ({
      message: ErrorsToTranslate.DATA_TYPES.DATE_IS_INVALID,
    }),
  }),
  read_quantity: z
    .number({
      errorMap: () => ({
        message: ErrorsToTranslate.DATA_TYPES.FORMAT_IS_INVALID,
      }),
    })
    .min(0)
    .optional(),
});
