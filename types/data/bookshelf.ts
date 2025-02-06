import { type bookshelfType, type reactionType } from "@prisma/client";
import { type Pick } from "@prisma/client/runtime/library";

import { type BookInterface, type GetBookInterface } from "./book";
import { type ReviewInterface } from "./review";

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

export interface BookshelfReviewsInterface extends GetBookInterface {
  review: ReviewInterface;
  review_reaction: { reaction: reactionType }[];
}
