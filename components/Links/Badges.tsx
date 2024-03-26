import { type FC, Suspense } from "react";

import { AccountSettings } from "../Modals/AccountSettings";
import { Settings } from "../Modals/Settings";
import { ProfileBadge } from "../Profile/ProfileBadge";
import { Loader } from "../ui/Loaders/Loader";

export const Badges: FC = ({}) => {
  return (
    <div className="flex h-fit gap-3">
      <AccountSettings>
        <Suspense fallback={<Loader />}>
          <ProfileBadge />
        </Suspense>
      </AccountSettings>
      <Settings />
    </div>
  );
};
