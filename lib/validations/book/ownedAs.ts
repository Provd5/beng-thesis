import { z } from "zod";

export type ownedAsType = "BOOK" | "EBOOK" | "AUDIOBOOK";

export const OwnedAsValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    ownedAs: z.enum(["BOOK", "EBOOK", "AUDIOBOOK"]),
  }),
});
