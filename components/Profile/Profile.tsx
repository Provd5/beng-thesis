import type { FC } from "react";
import { notFound } from "next/navigation";

import { getProfile } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";

import { AvatarImage } from "./AvatarImage";
import { FollowButton } from "./Follows/FollowButton";
import { ProfileSubpageLink } from "./Follows/FollowLink";
import { PrivateProfilePage } from "./PrivateProfilePage";
import { ProfileDescription } from "./ProfileDescription";
import { ProfileStatus } from "./ProfileStatus";

interface ProfileProps {
  profileName: string;
  children: React.ReactNode;
}

export const Profile: FC<ProfileProps> = async ({ profileName, children }) => {
  const sessionUser = await getSessionUser();
  const profileData = await getProfile(sessionUser?.id, profileName);

  if (!profileData) notFound();

  const isMyProfile = profileData.id === sessionUser?.id;

  return (
    <>
      <div className="mb-2 flex flex-col">
        <div className="flex gap-3">
          <div className="ml-0 mt-[-30px]">
            <div className="relative flex size-[115px] items-center justify-center rounded-full bg-gradient-to-t from-colors-primary via-colors-accent via-75% to-transparent to-85%">
              <AvatarImage size="lg" avatarSrc={profileData.avatar_url} />
              <ProfileStatus isPrivate={profileData.private} />
            </div>
          </div>
          <div className="ml-1 mt-3">
            <h1 className="break-word text-2xl font-bold text-colors-primary">
              {profileData.full_name}
            </h1>
            <div className="mt-1 flex w-fit flex-col gap-0.5 text-sm">
              <ProfileSubpageLink
                profileName={profileName}
                variant="followers"
                quantity={profileData._count.followed_by}
              />
              <ProfileSubpageLink
                profileName={profileName}
                variant="following"
                quantity={profileData._count.following}
              />
              <ProfileSubpageLink
                profileName={profileName}
                variant="statistics"
                quantity={0}
              />
              {!isMyProfile && (
                <div className="mt-2 grid">
                  <FollowButton
                    key={`FollowButton-${profileData.id}`}
                    userId={profileData.id}
                    isFollowed={profileData.is_followed}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {profileData.description && (
        <ProfileDescription description={profileData.description} />
      )}
      {!profileData.private || isMyProfile ? (
        <div className="mt-6 flex flex-col gap-3">{children}</div>
      ) : (
        <PrivateProfilePage />
      )}
    </>
  );
};
