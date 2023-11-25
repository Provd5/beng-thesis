import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const {
    data: { session },
  } = await readUserSession();

  const userData =
    session?.user &&
    (await db.profile.findUnique({
      where: { id: session.user.id },
      select: { full_name: true },
    }));

  if (!userData) notFound();

  userData.full_name
    ? redirect(`/profile/${userData.full_name}`)
    : redirect(`/edit-profile`);
}
