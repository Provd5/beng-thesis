import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";

import ThumbnailPlaceholder from "../../public/ThumbnailPlaceholder.png";

interface BookCoverProps {
  coverUrl: string | null;
  isLoader?: false;
  children?: React.ReactNode;
  size?: "default" | "lg";
}
interface BookCoverLoaderProps {
  coverUrl?: never;
  isLoader: true;
  children?: React.ReactNode;
  size?: "default" | "lg";
}

export const BookCover: FC<BookCoverProps | BookCoverLoaderProps> = ({
  isLoader,
  coverUrl,
  children,
  size = "default",
}) => {
  const sizes = {
    default: "97px",
    lg: "121px",
  };
  const sizeClass = {
    default: "h-[140px] w-[97px]",
    lg: "h-[175px] w-[121px]",
  };

  return (
    <div
      className={clsx(
        "relative flex-none overflow-hidden rounded-sm drop-shadow-book",
        sizeClass[size]
      )}
    >
      {isLoader ? (
        <div className="h-full w-full bg-gray" />
      ) : (
        <Image
          alt="Book cover"
          src={coverUrl ? coverUrl : ThumbnailPlaceholder}
          fill
          sizes={sizes[size]}
          className="pointer-events-none object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNsqAcAAYUBAdpOiIkAAAAASUVORK5CYII="
        />
      )}
      {children}
    </div>
  );
};
