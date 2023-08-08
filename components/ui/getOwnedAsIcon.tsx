import {
  AsAudiobook,
  AsBook,
  AsEbook,
} from "~/components/ui/SvgIcons/OwnedAsIcons";
import { type ownedAsType } from "~/lib/validations/book/ownedAs";

export const getOwnedAsIcon = (
  ownedAs: ownedAsType,
  size: "lg" | "default" | "sm" = "default"
) => {
  const sizeClass = {
    lg: "h-8 w-8",
    default: "h-7 w-7",
    sm: "h-6 w-6",
  };

  const renderIcon = (ownedAs: ownedAsType) => {
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
