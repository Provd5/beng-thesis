import { type FC } from "react";

import {
  getSessionUser,
  getSessionUserDetails,
} from "~/lib/services/session/queries";

import { AccountSettings } from "../Modals/AccountSettings";
import { Settings } from "../Modals/Settings";
import { ProfileBadge } from "../Profile/ProfileBadge";

export const Badges: FC = async ({}) => {
  const sessionUser = await getSessionUser();
  const userDetails = await getSessionUserDetails(sessionUser?.id);

  return (
    <div className="flex h-fit gap-3">
      {userDetails && (
        <AccountSettings>
          <ProfileBadge profileData={userDetails} />
        </AccountSettings>
      )}
      <Settings />
    </div>
  );
};
