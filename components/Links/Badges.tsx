import { type FC } from "react";

import { getSessionProfile } from "~/lib/services/profile";

import { AccountSettings } from "../Modals/AccountSettings";
import { Settings } from "../Modals/Settings";
import { ProfileBadge } from "../Profile/ProfileBadge";

export const Badges: FC = async ({}) => {
  const profileData = await getSessionProfile();

  return (
    <div className="flex h-fit gap-3">
      {profileData && (
        <AccountSettings>
          <ProfileBadge profileData={profileData} />
        </AccountSettings>
      )}
      <Settings />
    </div>
  );
};
