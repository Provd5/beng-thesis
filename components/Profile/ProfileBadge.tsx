import type { FC } from "react";
import Link from "next/link";

import { type GetProfileInterface } from "~/types/data/profile";

import ROUTES from "~/utils/routes";

import { AvatarImage } from "./AvatarImage";

interface ProfileBadgeProps {
  profileData: GetProfileInterface;
}

export const ProfileBadge: FC<ProfileBadgeProps> = ({ profileData }) => {
  return (
    <Link
      className="mx-[-14px] flex items-center gap-1.5 py-1 text-sm"
      href={ROUTES.profile.session_profile}
    >
      <AvatarImage avatarSrc={profileData.avatar_url} size="xs" />
      <span className="max-w-[150px] truncate">{profileData.full_name}</span>
    </Link>
  );
};
