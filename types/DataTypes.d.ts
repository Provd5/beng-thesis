import { type bookshelfType, type reactionType } from "@prisma/client";

interface ReviewInterface {
  id: string;
  created_at: Date;
  updated_at: Date | null;
  text: string | null;
  rate: number;
}

interface BookshelfInterface {
  bookshelfData: {
    bookshelf: bookshelfType | null;
    updated_at: Date;
    began_reading_at: Date | null;
    read_quantity: number;
  };
}

interface BookOwnedAsInterface {
  added_book_at: Date | null;
  added_ebook_at: Date | null;
  added_audiobook_at: Date | null;
}

interface ReactionTypeInterface {
  reaction: reactionType;
  user_id: string;
  review_id: string;
}

interface LikedByInterface {
  updated_at: Date;
}
