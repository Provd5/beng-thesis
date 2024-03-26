export type OwnedBookTypes = (typeof OwnedAsArray)[number];
export type BookshelvesTypes = (typeof BookshelvesArray)[number];
export type CategoriesTypes = (typeof CategoriesArray)[number];

export const OwnedAsArray = ["BOOK", "EBOOK", "AUDIOBOOK"] as const;

export const BookshelfArray = [
  "ALREADY_READ",
  "TO_READ",
  "ABANDONED",
  "READING",
  "OTHER",
] as const;

export const BookshelvesArray = [
  "OWNED",
  "LIKED",
  ...BookshelfArray,
  "REVIEWS",
] as const;

export const CategoriesArray = ["STATISTICS", ...BookshelvesArray] as const;
