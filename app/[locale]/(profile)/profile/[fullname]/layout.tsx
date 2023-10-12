import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { db } from "~/lib/db";

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
      <div className="mb-6 flex gap-1 xs:gap-3">
        <div className="ml-0 mt-[-30px] xs:ml-6">
          <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
            <AvatarImage size="lg" avatarSrc={publicUserData.avatar_url} />
            <ProfileStatus isPrivate={publicUserData.private} />
          </div>
        </div>
        <div>
          <h1 className="mx-0.5 my-2 break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
            {publicUserData.full_name}
          </h1>
          <FollowLinks
            followers={publicUserData._count.followed_by}
            following={publicUserData._count.following}
          />
        </div>
      </div>
      {session?.user &&
      publicUserData.id &&
      session.user.id === publicUserData.id ? (
        children
      ) : (
        <PrivateProfilePage />
      )}
    </>
  );
}
