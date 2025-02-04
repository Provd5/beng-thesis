import type { FC } from "react";

import {
  getSessionUser,
  getSessionUserDetails,
} from "~/lib/services/session/queries";

import { AvatarImage } from "../AvatarImage";
import { EditProfileForm } from "./EditProfileForm";

export const ManageProfile: FC = async () => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return;

  const userDetails = await getSessionUserDetails(sessionUser?.id);
  if (!userDetails) return;

  return (
    <div className="flex gap-3">
      <div className="mt-[-30px]">
        <div className="bodyGradientForAvatar relative flex size-[112px] items-center justify-center rounded-full">
          <AvatarImage size="lg" avatarSrc={userDetails.avatar_url} />
        </div>
      </div>
      <EditProfileForm profileData={userDetails} />
    </div>
  );
};
