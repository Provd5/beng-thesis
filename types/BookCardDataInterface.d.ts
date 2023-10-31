import { type bookshelfType, type reactionType } from "@prisma/client";

export interface BookCardDataInterface {
  id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
  _count: {
    review: number;
    liked_by: number;
  };
  review: {
    score: number;
  }[];
  bookshelf?:
    | {
        updated_at: Date;
        began_reading_at: Date | null;
        read_quantity: number;
        bookshelf: bookshelfType | null;
        title: string | null;
        user_id: string;
        book_id: string;
      }[]
    | null;
  book_owned_as?:
    | {
        added_book_at: Date | null;
        added_ebook_at: Date | null;
        added_audiobook_at: Date | null;
        user_id: string;
        book_id: string;
      }[]
    | null;

  liked_by?:
    | {
        updated_at: Date;
        book_id: string;
        user_id: string;
      }[]
    | null;
}

export interface BookReviewCardDataInterface {
  id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
  review: {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    text: string | null;
    score: number;
    author_id: string;
    book_id: string;
    review_reaction: {
      reaction: reactionType;
      user_id: string;
      review_id: string;
    }[];
  }[];
}
