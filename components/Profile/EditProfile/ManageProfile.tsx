import type { FC } from "react";

import { getProfile } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { AvatarImage } from "../AvatarImage";
import { EditProfileForm } from "./EditProfileForm";

export const ManageProfile: FC = async () => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return;

  const { data: sessionProfile } = await getProfile(sessionUser?.id);
  if (!sessionProfile) return;

  return (
    <div className="flex gap-3">
      <div className="mt-[-30px]">
        <div className="bodyGradientForAvatar relative flex size-[112px] items-center justify-center rounded-full">
          <AvatarImage size="lg" avatarSrc={sessionProfile.avatar_url} />
        </div>
      </div>
      <EditProfileForm profileData={sessionProfile} />
    </div>
  );
};
