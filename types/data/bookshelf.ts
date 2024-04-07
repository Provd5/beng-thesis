import { type bookshelfType } from "@prisma/client";
import { type Pick } from "@prisma/client/runtime/library";

import { type BookInterface } from "./book";

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
