import { notFound } from "next/navigation";

import { LoadingPage } from "~/components/ui/Loaders/LoadingPage";
import { type localeTypes, redirect } from "~/i18n/routing";
import { getProfile } from "~/lib/services/profile/queries";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

export default async function ProfileRedirectPage({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}) {
  const { locale } = await params;

  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect({ href: ROUTES.auth.login, locale });

  const sessionProfile = await getProfile(sessionUser?.id);
  if (!sessionProfile?.full_name) notFound();

  redirect({ href: ROUTES.profile.root(sessionProfile.full_name), locale });

  return <LoadingPage />;
}
