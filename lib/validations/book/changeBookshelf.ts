import { bookshelfType } from "@prisma/client";
import { z } from "zod";

export const ChangeBookshelfValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    bookshelf: z
      .enum([
        bookshelfType.ABANDONED,
        bookshelfType.ALREADY_READ,
        bookshelfType.OTHER,
        bookshelfType.READING,
        bookshelfType.TO_READ,
      ])
      .nullable(),
    beganReadingAt: z.string().nonempty().datetime().nullable(),
    updatedAt: z.string().nonempty().datetime().nullable(),
    readQuantity: z.number().min(0).nullable(),
  }),
});
