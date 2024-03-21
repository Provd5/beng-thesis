import type { FC } from "react";

import { ProfileService } from "~/lib/services/profile";

import { AvatarImage } from "../AvatarImage";
import { EditProfileForm } from "./EditProfileForm";

export const ManageProfile: FC = async () => {
  const profileService = new ProfileService();
  const profileData = await profileService.getSessionProfile();

  if (!profileData) return;

  return (
    <div className="flex gap-3">
      <div className="ml-0 mt-[-30px] xs:ml-6">
        <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
          <AvatarImage size="lg" avatarSrc={profileData.avatar_url} />
        </div>
      </div>
      <EditProfileForm profileData={profileData} />
    </div>
  );
};
