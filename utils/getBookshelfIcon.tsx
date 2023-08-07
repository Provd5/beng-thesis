import { type bookshelfType } from "@prisma/client";

import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarksFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";

import { BookmarksWrapper } from "~/components/Book/BookmarksWrapper";

export const getBookshelfIcon = (bookshelf: bookshelfType, size?: "sm") => {
  switch (bookshelf) {
    case "TO_READ":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkDashFill}
          color="blue"
        />
      );
    case "ALREADY_READ":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkCheckFill}
          color="green"
        />
      );
    case "ABANDONED":
      return (
        <BookmarksWrapper size={size} Icon={BsFillBookmarkXFill} color="red" />
      );
    case "READING":
      return (
        <BookmarksWrapper size={size} Icon={BsFillBookmarkFill} color="gray" />
      );
    case "OTHER":
    default:
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarksFill}
          color="default"
        />
      );
  }
};
