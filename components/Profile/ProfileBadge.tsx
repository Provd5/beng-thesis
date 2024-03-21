import type { FC } from "react";
import Link from "next/link";

import { ProfileService } from "~/lib/services/profile";
import ROUTES from "~/utils/routes";

import { AvatarImage } from "./AvatarImage";

export const ProfileBadge: FC = async () => {
  const profileService = new ProfileService();
  const profileData = await profileService.getSessionProfile();

  if (!profileData) return;

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
