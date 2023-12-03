import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

import { type localeTypes } from "~/i18n";
import { fetchPublicUserData } from "~/lib/actions/profile/fetch";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);
  const userData = await fetchPublicUserData();

  if (!userData) notFound();

  userData.full_name
    ? redirect(`/profile/${userData.full_name}`)
    : redirect(`/edit-profile`);
}
