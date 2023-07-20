import type { FC } from "react";
import Image from "next/image";
import clsx from "clsx";

import AvatarPlaceholder from "~/assets/AvatarPlaceholder.svg";

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
  const sizeVariants = {
    default: "h-[75px] w-[75px]",
    sm: "h-[50px] w-[50px]",
    lg: "h-[100px] w-[100px]",
  };

  return (
    <div className={clsx("relative", sizeVariants[size], className)}>
      <Image
        fill
        src={avatarSrc ? avatarSrc : (AvatarPlaceholder as string)}
        alt="Profile Avatar"
        className="rounded-full"
      />
    </div>
  );
};
