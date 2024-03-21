import { bookshelfType } from "@prisma/client";
import { z } from "zod";

export type ChangeBookshelfValidatorType = z.infer<
  typeof ChangeBookshelfValidator
>;
export const ChangeBookshelfValidator = z.object({
  bookId: z.string().uuid(),
  bookshelf: z
    .enum([
      bookshelfType.ABANDONED,
      bookshelfType.ALREADY_READ,
      bookshelfType.OTHER,
      bookshelfType.READING,
      bookshelfType.TO_READ,
    ])
    .nullable(),
  beganReadingAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  readQuantity: z.number().min(0).nullable(),
});
