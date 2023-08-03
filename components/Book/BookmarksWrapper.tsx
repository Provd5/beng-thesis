import type { FC } from "react";
import clsx from "clsx";

import { type IconType } from "react-icons/lib";

interface BookmarksWrapperProps {
  Icon: IconType;
  color:
    | "blue"
    | "green"
    | "red"
    | "gray"
    | "pink"
    | "yellow"
    | "gradient"
    | "default";
  size?: "default" | "sm";
}

export const BookmarksWrapper: FC<BookmarksWrapperProps> = ({
  Icon,
  color,
  size = "default",
}) => {
  const colorClass =
    color === "gradient"
      ? "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
      : `text-${color}`;

  const sizeClass = {
    default: "h-auto w-7 pt-1",
    sm: "h-auto w-4",
  };

  return (
    <div className="flex">
      <Icon
        className={clsx(
          "drop-shadow-icon",
          color === "default"
            ? "text-black-light dark:text-white-dark"
            : colorClass,
          sizeClass[size]
        )}
      />
    </div>
  );
};
