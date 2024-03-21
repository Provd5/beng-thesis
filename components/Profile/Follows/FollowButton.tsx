import { type FC } from "react";

import { ProfileService } from "~/lib/services/profile";

import { FollowForm } from "./FollowForm";

interface FollowButtonProps {
  userId: string;
}

export const FollowButton: FC<FollowButtonProps> = async ({ userId }) => {
  const profileService = new ProfileService();
  const followsData = await profileService.getFollowData(userId);

  return <FollowForm userId={userId} followsData={followsData} />;
};
