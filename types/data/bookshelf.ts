import { type bookshelfType } from "@prisma/client";
import { type Pick } from "@prisma/client/runtime/library";

import { type BookInterface } from "./book";

export type OwnedBookTypes = "BOOK" | "EBOOK" | "AUDIOBOOK";

export type CategoriesTypes = BookshelvesTypes | "STATISTICS";

export type BookshelvesTypes = bookshelfType | "OWNED" | "LIKED" | "REVIEWS";

export interface BookshelfInterface {
  updated_at: Date;
  bookshelf: bookshelfType | null;
  user_id: string;
  book_id: string;
  title: string | null;
  began_reading_at: Date | null;
  read_quantity: number;
}

export type BookshelfPreviewType = Pick<
  BookInterface,
  "id" | "title" | "authors" | "thumbnail_url"
>;

export interface ChangeBookshelfInterface {
  bookId: string;
  bookshelf: bookshelfType | null;
  beganReadingAt: Date | null;
  updatedAt: Date | null;
  readQuantity: number | null;
}
