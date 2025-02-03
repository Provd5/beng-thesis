import { Suspense } from "react";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ManageProfile } from "~/components/Profile/EditProfile/ManageProfile";
import { EditProfileLoader } from "~/components/ui/Loaders/Skeletons/EditProfileLoader";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("edit profile"),
  };
}

export default function EditProfilePage({}) {
  return (
    <Suspense key={"ManageProfile"} fallback={<EditProfileLoader />}>
      <ManageProfile />
    </Suspense>
  );
}
