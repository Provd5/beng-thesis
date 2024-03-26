import { type FC } from "react";

import { type OwnedBookTypes } from "~/types/consts";

import { AsAudiobook, AsBook, AsEbook } from "./SvgIcons/OwnedAsIcons";

interface OwnedBookIconProps {
  ownedAs: OwnedBookTypes;
  size?: "default" | "lg" | "sm";
}

export const OwnedBookIcon: FC<OwnedBookIconProps> = ({
  ownedAs,
  size = "default",
}) => {
  const sizeClass = {
    lg: "h-8 w-8",
    default: "h-7 w-7",
    sm: "h-6 w-6",
  };

  const renderIcon = (ownedAs: OwnedBookTypes) => {
    switch (ownedAs) {
      case "BOOK":
        return <AsBook />;
      case "EBOOK":
        return <AsEbook />;
      case "AUDIOBOOK":
        return <AsAudiobook />;
    }
  };

  return <div className={sizeClass[size]}>{renderIcon(ownedAs)}</div>;
};
