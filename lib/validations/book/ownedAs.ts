import { z } from "zod";

export const OwnedAsValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    ownedAs: z.enum(["BOOK", "EBOOK", "AUDIOBOOK"]),
  }),
});
