import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ManageProfile } from "~/components/Profile/EditProfile/ManageProfile";
import { LoadingPage } from "~/components/ui/Loaders/LoadingPage";
import { type localeTypes, redirect } from "~/i18n/routing";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("edit profile"),
  };
}

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}) {
  const { locale } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect({ href: ROUTES.auth.login, locale });
  }

  return (
    <Suspense key={"ManageProfile"} fallback={<LoadingPage />}>
      <ManageProfile />
    </Suspense>
  );
}
