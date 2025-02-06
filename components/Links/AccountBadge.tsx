import type { FC } from "react";

import { getProfile } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { AccountSettings } from "../Modals/AccountSettings";
import { ProfileBadge } from "../Profile/ProfileBadge";

export const AccountBadge: FC = async () => {
  const sessionUser = await getSessionUser();
  const sessionProfile = await getProfile(sessionUser?.id);

  if (!sessionProfile) return;

  return (
    <AccountSettings>
      <ProfileBadge profileData={sessionProfile} />
    </AccountSettings>
  );
};
