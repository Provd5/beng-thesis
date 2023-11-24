export type OrderByArrayType = {
  isSortingByLetters: boolean;
  sortCategory: string;
}[];

// the first element is the default sort

const commonBooksOrderArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "popularity" },
  { isSortingByLetters: false, sortCategory: "liked_by" },
  { isSortingByLetters: false, sortCategory: "review" },
  { isSortingByLetters: false, sortCategory: "published_date" },
  { isSortingByLetters: true, sortCategory: "title" },
  { isSortingByLetters: true, sortCategory: "authors" },
];

export const booksOrderByArray: OrderByArrayType = [...commonBooksOrderArray];

export const bookshelvesOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "last_added" },
  ...commonBooksOrderArray,
];

export const reviewsOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "profile_traffic" },
  { isSortingByLetters: false, sortCategory: "created_at" },
  { isSortingByLetters: false, sortCategory: "rate" },
  { isSortingByLetters: false, sortCategory: "review_reaction" },
];

export const profilesOrderByArray: OrderByArrayType = [
  { isSortingByLetters: false, sortCategory: "profile_traffic" },
  { isSortingByLetters: false, sortCategory: "book_owned_as" },
  { isSortingByLetters: false, sortCategory: "bookshelf" },
  { isSortingByLetters: false, sortCategory: "followed_by" },
  { isSortingByLetters: false, sortCategory: "review" },
  { isSortingByLetters: true, sortCategory: "full_name" },
];
