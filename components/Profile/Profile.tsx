import type { FC } from "react";
import { notFound } from "next/navigation";

import { getProfile } from "~/lib/services/profile";
import readUserSession from "~/lib/supabase/readUserSession";

import { AvatarImage } from "./AvatarImage";
import { FollowButton } from "./Follows/FollowButton";
import { FollowLink } from "./Follows/FollowLink";
import { PrivateProfilePage } from "./PrivateProfilePage";
import { ProfileDescription } from "./ProfileDescription";
import { ProfileStatus } from "./ProfileStatus";

interface ProfileProps {
  profileName: string;
  children: React.ReactNode;
}

export const Profile: FC<ProfileProps> = async ({ profileName, children }) => {
  const profileData = await getProfile(profileName);

  if (!profileData) notFound();

  const {
    data: { session },
  } = await readUserSession();

  const isMyProfile = session?.user.id === profileData.id;

  return (
    <>
      <div className="mb-2 flex flex-col">
        <div className="flex gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
              <AvatarImage size="lg" avatarSrc={profileData.avatar_url} />
              <ProfileStatus isPrivate={profileData.private} />
            </div>
          </div>
          <div className="mx-0.5 mt-3">
            <div className="flex w-fit flex-col gap-2 text-sm">
              <FollowLink
                profileName={profileName}
                variant="followers"
                quantity={profileData._count.followed_by}
              />
              <FollowLink
                profileName={profileName}
                variant="following"
                quantity={profileData._count.following}
              />
              {!isMyProfile && (
                <FollowButton
                  userId={profileData.id}
                  isFollowed={profileData.is_followed}
                />
              )}
            </div>
          </div>
        </div>
        <h1 className="break-word mx-0 mb-3 mt-1 text-xl font-semibold text-primary dark:text-primary-light xs:mx-6">
          {profileData.full_name}
        </h1>
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
