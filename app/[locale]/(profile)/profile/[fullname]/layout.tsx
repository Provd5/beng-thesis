import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { db } from "~/lib/db";
import { doIAlreadyFollowThisProfile } from "~/utils/doIAlreadyFollowThisProfile";

export default async function ProfileFullnameLayout({
  children,
  params: { fullname },
}: {
  children: React.ReactNode;
  params: { fullname: string };
}) {
  const publicUserData = await db.profile.findUnique({
    where: { full_name: fullname },
    select: {
      id: true,
      avatar_url: true,
      private: true,
      full_name: true,
      followed_by: true,
      _count: { select: { followed_by: true, following: true } },
    },
  });

  if (!publicUserData) notFound();

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <div className="mb-2 flex flex-col">
        <div className="flex gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
              <AvatarImage size="lg" avatarSrc={publicUserData.avatar_url} />
              <ProfileStatus isPrivate={publicUserData.private} />
            </div>
          </div>
          <div className="mx-0.5 mt-3">
            <FollowLinks
              userId={publicUserData.id}
              fullname={fullname}
              isMyProfile={session?.user.id === publicUserData.id}
              isFollowed={doIAlreadyFollowThisProfile(
                publicUserData.followed_by,
                session?.user.id
              )}
              followers={publicUserData._count.followed_by}
              following={publicUserData._count.following}
            />
          </div>
        </div>
        <h1 className="break-word mx-0 mb-3 mt-1 text-xl font-semibold text-primary dark:text-primary-light xs:mx-6">
          {publicUserData.full_name}
        </h1>
      </div>
      {(session?.user && session.user.id === publicUserData.id) ||
      !publicUserData.private ? (
        children
      ) : (
        <PrivateProfilePage />
      )}
    </>
  );
}
