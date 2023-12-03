import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";

import AvatarPlaceholder from "../../public/AvatarPlaceholder.png";

interface AvatarImageProps {
  avatarSrc: string | null;
  isLoader?: false;
  className?: string;
  size?: "default" | "sm" | "xs" | "lg";
}

interface AvatarImageLoaderProps {
  avatarSrc?: never;
  isLoader?: true;
  className?: string;
  size?: "default" | "sm" | "xs" | "lg";
}

export const AvatarImage: FC<AvatarImageProps | AvatarImageLoaderProps> = ({
  isLoader,
  avatarSrc,
  size = "default",
  className,
}) => {
  const sizes = {
    default: "75px",
    xs: "25px",
    sm: "50px",
    lg: "100px",
  };
  const sizeClass = {
    default: "h-[75px] w-[75px]",
    xs: "h-[25px] w-[25px]",
    sm: "h-[50px] w-[50px]",
    lg: "h-[100px] w-[100px]",
  };

  return (
    <div className={clsx("relative flex-none", sizeClass[size], className)}>
      {isLoader ? (
        <div className="h-full w-full rounded-full bg-gray" />
      ) : (
        <Image
          sizes={sizes[size]}
          fill
          src={avatarSrc ? avatarSrc : AvatarPlaceholder}
          alt="Profile Avatar"
          className="pointer-events-none rounded-full"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNsqAcAAYUBAdpOiIkAAAAASUVORK5CYII="
        />
      )}
    </div>
  );
};
