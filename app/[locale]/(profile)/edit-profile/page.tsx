import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { ManageProfileDescription } from "~/components/Profile/EditProfile/ManageProfileDescription";
import { ManageProfileStatus } from "~/components/Profile/EditProfile/ManageProfileStatus";
import { ManageProfileUsername } from "~/components/Profile/EditProfile/ManageProfileUsername";
import { type localeTypes } from "~/i18n";
import { fetchPublicUserData } from "~/lib/actions/profile/fetch";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("edit profile"),
  };
}

export default async function EditProfilePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const userData = await fetchPublicUserData();
  if (!userData) notFound();

  return (
    <>
      <div className="flex gap-3">
        <div className="ml-0 mt-[-30px] xs:ml-6">
          <div className="bodyGradientForAvatar relative flex h-[112px] w-[112px] items-center justify-center rounded-full">
            <AvatarImage size="lg" avatarSrc={userData.avatar_url} />
          </div>
        </div>
        <ManageProfileStatus isPrivate={userData.private} />
      </div>
      <div className="mt-2 flex flex-col gap-5">
        <ManageProfileUsername userFullname={userData.full_name} />
        <ManageProfileDescription userDescription={userData.description} />
      </div>
    </>
  );
}
