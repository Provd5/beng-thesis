import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileDescription } from "~/components/Profile/ProfileDescription";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { type localeTypes } from "~/i18n";
import { fetchPublicUserData } from "~/lib/actions/profile/fetch";

export function generateMetadata({ params }: { params: { fullname: string } }) {
  return {
    title: {
      default: `@${decodeURIComponent(params.fullname)}`,
      template: `@${decodeURIComponent(params.fullname)}/%s | Booksphere`,
    },
  };
}

export default async function ProfileFullnameLayout({
  children,
  params: { fullname, locale },
}: {
  children: React.ReactNode;
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const publicUserData = await fetchPublicUserData(fullname);

  if (!publicUserData) notFound();

  return (
    <>
      <div className="mb-2 flex flex-col">
        <div className="flex gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
              <AvatarImage size="lg" avatarSrc={publicUserData.avatar_url} />
              <ProfileStatus isPrivate={publicUserData.private} />
            </div>
          </div>
          <div className="mx-0.5 mt-3">
            <FollowLinks
              userId={publicUserData.id}
              fullname={fullname}
              isMyProfile={publicUserData.isMyProfile}
              isFollowed={publicUserData.isFollowed}
              followers={publicUserData._count.followed_by}
              following={publicUserData._count.following}
            />
          </div>
        </div>
        <h1 className="break-word mx-0 mb-3 mt-1 text-xl font-semibold text-primary dark:text-primary-light xs:mx-6">
          {publicUserData.full_name}
        </h1>
      </div>
      {publicUserData.description && (
        <ProfileDescription description={publicUserData.description} />
      )}
      {!publicUserData.private || publicUserData.isMyProfile ? (
        <div className="mt-6 flex flex-col gap-3">{children}</div>
      ) : (
        <PrivateProfilePage />
      )}
    </>
  );
}
