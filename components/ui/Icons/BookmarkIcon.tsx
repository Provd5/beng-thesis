import type { FC } from "react";
import clsx from "clsx";

import { type IconType } from "react-icons/lib";
import {
  BsFillBookmarkCheckFill,
  BsFillBookmarkDashFill,
  BsFillBookmarkFill,
  BsFillBookmarkHeartFill,
  BsFillBookmarksFill,
  BsFillBookmarkStarFill,
  BsFillBookmarkXFill,
} from "react-icons/bs";

import { type BookshelvesTypes } from "~/types/data/bookshelf";

type sizes = "default" | "lg" | "sm";

interface BookshelfBookmarkIconProps {
  category: BookshelvesTypes;
  Icon?: never;
  color?: never;
  size?: sizes;
}

interface BookmarkIconProps {
  category?: never;
  Icon: IconType;
  color: "gradient" | `fill-${string}`;
  size?: sizes;
}

export const BookmarkIcon: FC<
  BookmarkIconProps | BookshelfBookmarkIconProps
> = ({ category, Icon, color, size = "default" }) => {
  const sizeClass = {
    lg: "w-7 py-2",
    default: "w-5 py-1",
    sm: "w-4 py-0.5",
  };

  let bookshelfBookmark: {
    Icon: IconType;
    color: `fill-${string}`;
  };

  switch (category) {
    case "TO_READ":
      bookshelfBookmark = {
        Icon: BsFillBookmarkDashFill,
        color: "fill-blue",
      };
      break;

    case "ALREADY_READ":
      bookshelfBookmark = {
        Icon: BsFillBookmarkCheckFill,
        color: "fill-green",
      };
      break;

    case "ABANDONED":
      bookshelfBookmark = {
        Icon: BsFillBookmarkXFill,
        color: "fill-red",
      };
      break;

    case "READING":
      bookshelfBookmark = {
        Icon: BsFillBookmarkFill,
        color: "fill-primary-light",
      };
      break;

    case "LIKED":
      bookshelfBookmark = {
        Icon: BsFillBookmarkHeartFill,
        color: "fill-pink",
      };
      break;

    case "REVIEWS":
      bookshelfBookmark = {
        Icon: BsFillBookmarkStarFill,
        color: "fill-yellow",
      };
      break;

    case "OTHER":
    default:
      bookshelfBookmark = {
        Icon: BsFillBookmarksFill,
        color: "fill-gray",
      };
      break;
  }

  return (
    <div className="flex self-start">
      {Icon ? (
        <Icon
          className={clsx(
            "h-auto drop-shadow-icon",
            color === "gradient"
              ? "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
              : color,
            sizeClass[size]
          )}
        />
      ) : (
        <bookshelfBookmark.Icon
          className={clsx(
            "h-auto drop-shadow-icon",
            bookshelfBookmark.color,
            sizeClass[size]
          )}
        />
      )}
    </div>
  );
};
