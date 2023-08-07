import { AsAudiobook, AsBook, AsEbook } from "~/components/Book/OwnedAsIcons";
import { type ownedAsType } from "~/lib/validations/book/ownedAs";

export const getOwnedAsIcon = (
  condition: boolean,
  ownedAs: ownedAsType,
  size: "default" | "sm" | "xs" = "default"
) => {
  const sizeClass = {
    default: "h-8 w-8",
    sm: "h-7 w-7",
    xs: "h-5 w-5",
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

  return condition ? (
    <div className={sizeClass[size]}>{renderIcon(ownedAs)}</div>
  ) : null;
};
