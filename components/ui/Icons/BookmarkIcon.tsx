import type { FC } from "react";

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

import { type BookshelvesTypes } from "~/types/consts";

import { cn } from "~/utils/cn";

type sizes = "default" | "lg" | "sm";

interface BookshelfBookmarkIconProps {
  category: BookshelvesTypes;
  Icon?: never;
  color?: "gradient" | `fill-${string}`;
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
        color: "fill-colors-blue",
      };
      break;

    case "ALREADY_READ":
      bookshelfBookmark = {
        Icon: BsFillBookmarkCheckFill,
        color: "fill-colors-green",
      };
      break;

    case "ABANDONED":
      bookshelfBookmark = {
        Icon: BsFillBookmarkXFill,
        color: "fill-colors-red",
      };
      break;

    case "READING":
      bookshelfBookmark = {
        Icon: BsFillBookmarkFill,
        color: "fill-colors-cyan",
      };
      break;

    case "LIKED":
      bookshelfBookmark = {
        Icon: BsFillBookmarkHeartFill,
        color: "fill-colors-pink",
      };
      break;

    case "REVIEWS":
      bookshelfBookmark = {
        Icon: BsFillBookmarkStarFill,
        color: "fill-colors-yellow",
      };
      break;

    case "OTHER":
    default:
      bookshelfBookmark = {
        Icon: BsFillBookmarksFill,
        color: "fill-colors-gray",
      };
      break;
  }

  return (
    <div className="flex">
      {Icon ? (
        <Icon
          className={cn(
            "h-auto drop-shadow-icon",
            color === "gradient" ? "fill-colors-primary" : color,
            sizeClass[size],
          )}
        />
      ) : (
        <bookshelfBookmark.Icon
          className={cn(
            "h-auto drop-shadow-icon",
            color
              ? color === "gradient"
                ? "fill-colors-primary"
                : color
              : bookshelfBookmark.color,
            sizeClass[size],
          )}
        />
      )}
    </div>
  );
};
