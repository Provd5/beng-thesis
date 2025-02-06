import { type BookshelfInterface } from "./bookshelf";

export interface RawGetBookData extends BookInterface {
  _count: {
    liked_by: number;
    review: number;
  };
  review: { rate: number; author_id: string; created_at: Date }[];
  book_owned_as: BookOwnedAsInterface[];
  liked_by: LikedBookInterface[];
  bookshelf: BookshelfInterface[];
}

export interface GetBookInterface {
  book: BookInterface;
  _count: {
    liked_by: number;
    review: number;
  };
  _avg_rate: number;
  review: { rate: number; created_at: Date } | null | undefined;
  book_owned_as: BookOwnedAsInterface | null | undefined;
  liked_by: LikedBookInterface | null | undefined;
  bookshelf: BookshelfInterface | null | undefined;
}

export interface BookInterface {
  id: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  publisher: string | null;
  published_date: string;
  description: string | null;
  isbn_10: string;
  isbn_13: string;
  page_count: number;
  thumbnail_url: string | null;
  categories: string[];
}

export interface BookOwnedAsInterface {
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  added_audiobook_at: Date | null;
  updated_at: Date | null;
  user_id: string;
  book_id: string;
}

export interface LikedBookInterface {
  book_id: string;
  user_id: string;
  updated_at: Date;
}
