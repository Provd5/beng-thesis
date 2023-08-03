import { z } from "zod";

export enum ownedAsEnum {
  BOOK = "BOOK",
  EBOOK = "EBOOK",
  AUDIOBOOK = "AUDIOBOOK",
}

export const OwnedAsValidator = z.object({
  formData: z.object({
    bookId: z.string(),
    ownedAs: z.enum([
      ownedAsEnum.BOOK,
      ownedAsEnum.EBOOK,
      ownedAsEnum.AUDIOBOOK,
    ]),
  }),
});
