import { type FC } from "react";

import { FollowForm } from "./FollowForm";

interface FollowButtonProps {
  userId: string;
  isFollowed: boolean | undefined;
}

export const FollowButton: FC<FollowButtonProps> = ({ userId, isFollowed }) => {
  if (isFollowed === undefined) return;

  return (
    <FollowForm
      key={`FollowForm-${userId}`}
      userId={userId}
      isFollowed={isFollowed}
    />
  );
};
