import { Suspense } from "react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { ManageProfile } from "~/components/Profile/EditProfile/ManageProfile";
import { EditProfileLoader } from "~/components/ui/Loaders/Skeletons/EditProfileLoader";
import { type localeTypes } from "~/i18n";

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

export default function EditProfilePage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <Suspense key={"ManageProfile"} fallback={<EditProfileLoader />}>
      <ManageProfile />
    </Suspense>
  );
}
