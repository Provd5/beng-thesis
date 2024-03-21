import { type BookInterface } from "./data/book";
import { type ProfileInterface } from "./data/profile";
import { type ReviewInterface } from "./data/review";

export type OrderType = "desc" | "asc";

export type SortsType =
  | SortBooksType
  | SortProfilesType
  | SortFollowProfilesType
  | SortReviewsType
  | SortBookshelvesType
  | SortReviewBookshelfType;

export type SortBooksType =
  | keyof Pick<BookInterface, "title" | "authors" | "published_date">
  | "popularity";

export type SortBookshelvesType = SortBooksType | "last_added";

export type SortReviewBookshelfType =
  | SortBookshelvesType
  | "rate"
  | "reactions";

export type SortProfilesType =
  | keyof Pick<ProfileInterface, "full_name">
  | "activity"
  | "owned_books"
  | "books_on_shelves"
  | "followers"
  | "reviews";

export type SortFollowProfilesType = SortProfilesType | "last_added";

export type SortReviewsType =
  | keyof Pick<ReviewInterface, "rate" | "created_at">
  | "activity"
  | "review_reaction";
