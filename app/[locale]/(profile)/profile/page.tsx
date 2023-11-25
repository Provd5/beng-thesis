import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

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
