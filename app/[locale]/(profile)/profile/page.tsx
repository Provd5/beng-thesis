import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createTranslator } from "next-intl";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { CreateUsername } from "~/components/Auth/CreateUsername";
import { AvatarImage } from "~/components/Profile/AvatarImage";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";
import { dateFormater } from "~/utils/dateFormater";

import { getMessages } from "../../layout";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userExists = session?.user;

  if (!userExists) {
    redirect(`/login`);
  }

  const userData = await db.profile.findFirst({
    where: { id: userExists.id },
    select: { full_name: true, avatar_url: true, created_at: true },
  });

  if (!userData) {
    redirect(`/login`);
  }

  if (userData.full_name) redirect(`/profile/${userData.full_name}`);
  else
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="relative mb-10 flex h-full max-w-sm flex-col items-center justify-center gap-6 px-3 py-6 text-sm text-white-light">
          <div className="flex flex-col gap-1">
            <AvatarImage
              size="lg"
              avatarSrc={userData.avatar_url}
              className="mb-1 self-center"
            />
            <div className="flex flex-col gap-1">
              <p className="self-center">{userExists.email}</p>
              <p>
                <span className="font-semibold">
                  {t("EditUsername.account created:")}
                </span>{" "}
                {dateFormater(userData.created_at, true)}
              </p>
              <p>
                <span className="font-semibold">
                  {t("EditUsername.created by:")}
                </span>{" "}
                <span className="uppercase">
                  {userExists.app_metadata.provider}
                </span>
              </p>
            </div>
          </div>
          <CreateUsername fullName={userData.full_name} />
        </div>
      </div>
    );
}
