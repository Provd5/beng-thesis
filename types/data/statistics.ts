import { type BookshelfPreviewType } from "./bookshelf";

export interface BookshelfQuantitiesInterface {
  book_owned_as: number;
  liked_book: number;
  review: number;
  abandoned: number;
  already_read: number;
  reading: number;
  to_read: number;
  other: number;
}

export interface OwnedBooksInterface {
  lastAdded: BookshelfPreviewType | null;
  totalOwnedBooks: number;
  updatedAt: Date | null;
}

export interface ReadBooksInterface {
  lastRead: BookshelfPreviewType | null;
  mostRead: { book: BookshelfPreviewType; read_quantity: number } | null;
  totalRead: number;
  totalReadPages: number;
  updatedAt: Date | null;
}
