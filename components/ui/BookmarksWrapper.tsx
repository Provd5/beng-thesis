import type { FC } from "react";
import clsx from "clsx";

import { type IconType } from "react-icons/lib";

import { type bookmarkSizes } from "~/types/sizes";

interface BookmarksWrapperProps {
  Icon: IconType;
  color: "gradient" | `fill-${string}`;
  size?: bookmarkSizes;
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
    lg: "w-7 pt-1",
    default: "w-5",
    sm: "w-4",
  };

  return (
    <div className="flex">
      <Icon
        className={clsx("h-auto drop-shadow-icon", colorClass, sizeClass[size])}
      />
    </div>
  );
};
