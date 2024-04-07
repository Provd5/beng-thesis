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
    lg: "size-8",
    default: "size-7",
    sm: "size-6",
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
