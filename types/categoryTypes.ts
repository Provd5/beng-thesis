import { type bookshelfType } from "@prisma/client";

export type CategoryTypes =
  | bookshelfType
  | "OWNED"
  | "LIKED"
  | "REVIEWS"
  | "STATISTICS";

export const categoryArray: CategoryTypes[] = [
  "STATISTICS",
  "OWNED",
  "LIKED",
  "ALREADY_READ",
  "TO_READ",
  "ABANDONED",
  "READING",
  "OTHER",
  "REVIEWS",
];

export type OwnedAsType = "BOOK" | "EBOOK" | "AUDIOBOOK";

export const ownedAsArray: OwnedAsType[] = ["BOOK", "EBOOK", "AUDIOBOOK"];
