import type { FC } from "react";

import { type GetProfileInterface } from "~/types/data/profile";

import { Link } from "~/i18n/routing";
import ROUTES from "~/utils/routes";

import { AvatarImage } from "./AvatarImage";

interface ProfileBadgeProps {
  profileData: GetProfileInterface;
}

export const ProfileBadge: FC<ProfileBadgeProps> = ({ profileData }) => {
  return (
    <Link
      className="mx-[-8px] flex items-center gap-1.5 py-1 text-sm transition-transform hover:translate-x-1"
      href={ROUTES.profile.session_profile}
    >
      <AvatarImage avatarSrc={profileData.avatar_url} size="xs" />
      <span className="max-w-[150px] truncate">{profileData.full_name}</span>
    </Link>
  );
};
