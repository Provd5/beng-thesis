import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";

import { AvatarPlaceholder } from "../ui/SvgIcons/AvatarPlaceholder";

interface AvatarImageProps {
  avatarSrc?: string | null;
  className?: string;
  size?: "default" | "sm" | "xs" | "lg";
}

export const AvatarImage: FC<AvatarImageProps> = ({
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
      {avatarSrc ? (
        <Image
          sizes={sizes[size]}
          fill
          priority
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
