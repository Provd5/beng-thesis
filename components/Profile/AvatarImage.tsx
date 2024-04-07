import type { FC } from "react";
import Image from "next/image";

import { cn } from "~/utils/cn";

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
    default: "size-[75px]",
    xs: "size-[25px]",
    sm: "size-[50px]",
    lg: "size-[100px]",
  };

  return (
    <div className={cn("relative flex-none", sizeClass[size], className)}>
      {isLoader ? (
        <div className="size-full rounded-full border border-colors-text/30 bg-colors-gray" />
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
