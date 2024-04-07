import type { FC } from "react";

import { type GetProfileInterface } from "~/types/data/profile";

import { AvatarImage } from "~/components/Profile/AvatarImage";

interface CreateReviewProfileDetailsProps {
  profileData: GetProfileInterface;
}

export const CreateReviewProfileDetails: FC<
  CreateReviewProfileDetailsProps
> = ({ profileData }) => {
  return (
    <div className="flex flex-none items-start gap-1 px-2 sm:w-24 sm:flex-col sm:items-center">
      <AvatarImage
        className="drop-shadow-icon"
        size="sm"
        avatarSrc={profileData.avatar_url}
      />
      <h1 className="line-clamp-3 break-words font-bold">
        {profileData.full_name}
      </h1>
    </div>
  );
};
