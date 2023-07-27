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
}

export const BookmarksWrapper: FC<BookmarksWrapperProps> = ({
  Icon,
  color,
}) => {
  const sharedClass = "h-auto w-7 drop-shadow-icon";
  const colorClass =
    color === "gradient"
      ? "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
      : `text-${color}`;

  return (
    <div className="flex pt-1">
      <Icon className={clsx(sharedClass, color !== "default" && colorClass)} />
    </div>
  );
};
