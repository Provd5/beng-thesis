import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";

import { AvatarPlaceholder } from "./AvatarPlaceholder";

type sizes = "default" | "sm" | "lg";

interface AvatarImageProps {
  avatarSrc?: string | null;
  className?: string;
  size?: sizes;
}

export const AvatarImage: FC<AvatarImageProps> = ({
  avatarSrc,
  size = "default",
  className,
}) => {
  const sizes = {
    default: "75px",
    sm: "50px",
    lg: "100px",
  };
  const sizeClass = {
    default: "h-[75px] w-[75px]",
    sm: "h-[50px] w-[50px]",
    lg: "h-[100px] w-[100px]",
  };

  return (
    <div className={clsx("relative shrink-0", sizeClass[size], className)}>
      {avatarSrc ? (
        <Image
          sizes={sizes[size]}
          fill
          src={avatarSrc}
          alt="Profile Avatar"
          className="pointer-events-none rounded-full"
        />
      ) : (
        <AvatarPlaceholder />
      )}
    </div>
  );
};
