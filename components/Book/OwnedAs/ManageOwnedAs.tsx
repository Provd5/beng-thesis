import { type FC } from "react";

import { BookService } from "~/lib/services/book";

import { AddOwnedAsForm } from "./AddOwnedAsForm";

interface ManageOwnedAsProps {
  bookId: string;
}

export const ManageOwnedAs: FC<ManageOwnedAsProps> = async ({ bookId }) => {
  const bookService = new BookService();
  const ownedAsData = await bookService.getOwnedAsData(bookId);

  if (ownedAsData === undefined) return;

  return <AddOwnedAsForm bookId={bookId} ownedAsData={ownedAsData} />;
};
