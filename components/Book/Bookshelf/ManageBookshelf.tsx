import { type FC } from "react";

import { BookService } from "~/lib/services/book";

import { HandleChangeBookshlef } from "./HandleChangeBookshlef";

interface ManageBookshelfProps {
  bookId: string;
}

export const ManageBookshelf: FC<ManageBookshelfProps> = async ({ bookId }) => {
  const booksService = new BookService();
  const bookshelfData = await booksService.getBookshelfData(bookId);

  if (bookshelfData === undefined) return;

  return (
    <HandleChangeBookshlef bookId={bookId} bookshelfData={bookshelfData} />
  );
};
