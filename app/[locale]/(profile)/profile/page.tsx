import { notFound } from "next/navigation";

import { type localeTypes, redirect } from "~/i18n/routing";
import {
  getSessionUser,
  getSessionUserDetails,
} from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

export default async function ProfileRedirectPage({
  params,
}: {
  params: { locale: localeTypes };
}) {
  const { locale } = await params;

  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect({ href: ROUTES.auth.login, locale });

  const sessionUserDetails = await getSessionUserDetails(sessionUser?.id);
  if (!sessionUserDetails?.full_name) notFound();

  redirect({ href: ROUTES.profile.root(sessionUserDetails.full_name), locale });
}
