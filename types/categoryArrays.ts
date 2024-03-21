import { type bookshelfType } from "@prisma/client";

import {
  type BookshelvesTypes,
  type CategoriesTypes,
  type OwnedBookTypes,
} from "./data/bookshelf";

export const OwnedAsArray: OwnedBookTypes[] = ["BOOK", "EBOOK", "AUDIOBOOK"];

export const BookshelfArray: bookshelfType[] = [
  "ABANDONED",
  "ALREADY_READ",
  "OTHER",
  "READING",
  "TO_READ",
];

export const BookshelvesArray: BookshelvesTypes[] = [
  ...BookshelfArray,
  "OWNED",
  "LIKED",
  "REVIEWS",
];

export const CategoriesArray: CategoriesTypes[] = [
  ...BookshelvesArray,
  "STATISTICS",
];
