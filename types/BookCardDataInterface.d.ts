import { type bookshelfType, type reactionType } from "@prisma/client";

interface BookBaseInterface {
  id: string;
  title: string;
  authors: string[];
  thumbnail_url: string | null;
}

interface BookInterface extends BookBaseInterface {
  review: {
    score: number;
  }[];
  _count: {
    review: number;
    liked_by: number;
  };
  bookshelf?: Bookshelf[] | null;
  book_owned_as?: BookOwnedAs[] | null;
  liked_by?: LikedBy[] | null;
}

interface BookCardInterface {
  book: BookInterface;
}

interface BookReviewCardInterface {
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
    review: ReviewInterface[];
  };
}

interface ReviewInterface {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  text: string | null;
  score: number;
  review_reaction: ReactionTypeInterface[];
}

interface BookshelfInterface {
  updated_at: Date;
  began_reading_at: Date | null;
  read_quantity: number;
  bookshelf: bookshelfType | null;
  title: string | null;
}

interface BookOwnedAsInterface {
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  added_audiobook_at: Date | null;
}

interface ReactionTypeInterface {
  reaction: reactionType;
}

interface LikedByInterface {
  updated_at: Date;
}
