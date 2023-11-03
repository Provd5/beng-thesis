import type { FC } from "react";
import clsx from "clsx";

import { type IconType } from "react-icons/lib";

import { type BookmarkSizes } from "~/types/Sizes";

interface BookmarksWrapperProps {
  Icon: IconType;
  color: "gradient" | `fill-${string}`;
  size?: BookmarkSizes;
}

export const BookmarksWrapper: FC<BookmarksWrapperProps> = ({
  Icon,
  color,
  size = "default",
}) => {
  const colorClass =
    color === "gradient"
      ? "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
      : color;

  const sizeClass = {
    lg: "w-7 py-2",
    default: "w-5 py-1",
    sm: "w-4 py-0.5",
  };

  return (
    <div className="flex self-start">
      <Icon
        className={clsx("h-auto drop-shadow-icon", colorClass, sizeClass[size])}
      />
    </div>
  );
};
