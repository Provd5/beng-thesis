import { type FC } from "react";

import { type GetProfileInterface } from "~/types/data/profile";

import { FollowButton } from "../Follows/FollowButton";
import { ProfileCardDetails } from "./ProfileCardDetails";

interface ProfileCardProps {
  profileData: GetProfileInterface;
}

export const ProfileCard: FC<ProfileCardProps> = ({ profileData }) => {
  return (
    <div className="flex h-full w-full max-w-[400px] flex-col gap-2 rounded-md bg-white px-6 py-3 drop-shadow dark:bg-black">
      <ProfileCardDetails profileData={profileData} />
      <FollowButton
        userId={profileData.id}
        isFollowed={profileData.is_followed}
      />
    </div>
  );
};
