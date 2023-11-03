import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarkHeartFill,
  BsFillBookmarksFill,
  BsFillBookmarkStarFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";

import { type CategoryTypes } from "~/types/CategoryTypes";
import { type BookmarkSizes } from "~/types/Sizes";

import { BookmarksWrapper } from "~/components/ui/BookmarksWrapper";

export const getBookmarkIcon = (
  category: CategoryTypes,
  size: BookmarkSizes = "default"
) => {
  switch (category) {
    case "TO_READ":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkDashFill}
          color="fill-blue"
        />
      );
    case "ALREADY_READ":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkCheckFill}
          color="fill-green"
        />
      );
    case "ABANDONED":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkXFill}
          color="fill-red"
        />
      );
    case "READING":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkFill}
          color="fill-primary-light"
        />
      );
    case "OTHER":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarksFill}
          color="fill-gray"
        />
      );
    case "LIKED":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkHeartFill}
          color="fill-pink"
        />
      );
    case "REVIEWS":
      return (
        <BookmarksWrapper
          size={size}
          Icon={BsFillBookmarkStarFill}
          color="fill-yellow"
        />
      );
    default:
      return null;
  }
};
