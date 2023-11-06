export type OrderByArrayType = {
  isSortingByLetters: boolean;
  sortCategory: string;
}[];

//the first element is the default sort

export const booksOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "popularity" },
  { isSortingByLetters: false, sortCategory: "liked_by" },
  { isSortingByLetters: false, sortCategory: "review" },
  { isSortingByLetters: false, sortCategory: "published_date" },
  { isSortingByLetters: true, sortCategory: "title" },
  { isSortingByLetters: true, sortCategory: "authors" },
  { isSortingByLetters: true, sortCategory: "publisher" },
];

export const bookshelvesOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "last_added" },
  { isSortingByLetters: false, sortCategory: "liked_by" },
  { isSortingByLetters: false, sortCategory: "review" },
  { isSortingByLetters: false, sortCategory: "published_date" },
  { isSortingByLetters: true, sortCategory: "title" },
  { isSortingByLetters: true, sortCategory: "authors" },
  { isSortingByLetters: true, sortCategory: "publisher" },
];

export const reviewsOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "created_at" },
  { isSortingByLetters: false, sortCategory: "score" },
  { isSortingByLetters: false, sortCategory: "review_reaction" },
];
