import type { FC } from "react";
import Image from "next/image";

import AvatarPlaceholder from "~/assets/AvatarPlaceholder.svg";

interface AvatarImageProps {
  avatarSrc?: string | null;
  className?: string;
}

export const AvatarImage: FC<AvatarImageProps> = ({ avatarSrc, className }) => {
  return (
    <Image
      src={avatarSrc ? avatarSrc : (AvatarPlaceholder as string)}
      alt="Profile Avatar"
      className={className ?? "" + " rounded-full"}
    />
  );
};
