import { notFound, redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

import { type localeTypes } from "~/i18n";
import { getSessionProfile } from "~/lib/services/profile";
import ROUTES from "~/utils/routes";

export default async function CheckUsernamePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);
  const userData = await getSessionProfile();

  if (!userData) notFound();

  userData.full_name
    ? redirect(`${ROUTES.profile.root(userData.full_name)}`)
    : redirect(ROUTES.profile.edit_profile);
}
