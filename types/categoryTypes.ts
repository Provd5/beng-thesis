import { type bookshelfType } from "@prisma/client";

import { type ownedAsType } from "~/lib/validations/book/ownedAs";

export type categoryTypes =
  | bookshelfType
  | "OWNED"
  | "LIKED"
  | "REVIEWS"
  | "STATISTICS";

export const CategoryArray: categoryTypes[] = [
  "OWNED",
  "LIKED",
  "ALREADY_READ",
  "TO_READ",
  "ABANDONED",
  "READING",
  "OTHER",
  "REVIEWS",
];

export const OwnedAsArray: ownedAsType[] = ["BOOK", "EBOOK", "AUDIOBOOK"];
