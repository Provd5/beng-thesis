import { type FC } from "react";

import { type OwnedBookTypes } from "~/types/consts";

import { cn } from "~/utils/cn";

import { AsAudiobook, AsBook, AsEbook } from "./SvgIcons/OwnedAsIcons";

interface OwnedBookIconProps {
  ownedAs: OwnedBookTypes;
  size?: "default" | "lg" | "sm";
  color?: `fill-${string}`;
}

export const OwnedBookIcon: FC<OwnedBookIconProps> = ({
  ownedAs,
  size = "default",
  color = "default",
}) => {
  const sizeClass = {
    lg: "size-8",
    default: "size-7",
    sm: "size-6",
  };

  const colorClass = color === "default" ? "fill-colors-primary" : color;
  const commonClass = "drop-shadow-icon";

  const renderIcon = (ownedAs: OwnedBookTypes) => {
    switch (ownedAs) {
      case "BOOK":
        return (
          <AsBook className={cn(sizeClass[size], colorClass, commonClass)} />
        );
      case "EBOOK":
        return (
          <AsEbook className={cn(sizeClass[size], colorClass, commonClass)} />
        );
      case "AUDIOBOOK":
        return (
          <AsAudiobook
            className={cn(sizeClass[size], colorClass, commonClass)}
          />
        );
    }
  };

  return renderIcon(ownedAs);
};
