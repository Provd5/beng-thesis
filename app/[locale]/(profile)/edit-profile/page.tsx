import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { ManageProfileDescription } from "~/components/Profile/EditProfile/ManageProfileDescription";
import { ManageProfileStatus } from "~/components/Profile/EditProfile/ManageProfileStatus";
import { ManageProfileUsername } from "~/components/Profile/EditProfile/ManageProfileUsername";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

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

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userData =
    session?.user &&
    (await db.profile.findUnique({
      where: { id: session.user.id },
      select: {
        avatar_url: true,
        full_name: true,
        private: true,
        description: true,
      },
    }));

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
