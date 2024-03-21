import { z } from "zod";

export type LikeBookValidatorType = z.infer<typeof LikeBookValidator>;
export const LikeBookValidator = z.object({
  bookId: z.string().uuid(),
});

export type OwnedAsValidatorType = z.infer<typeof OwnedAsValidator>;
export const OwnedAsValidator = z.object({
  bookId: z.string().uuid(),
  ownedAs: z.enum(["BOOK", "EBOOK", "AUDIOBOOK"]),
});
