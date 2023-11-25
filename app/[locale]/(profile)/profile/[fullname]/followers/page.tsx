import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { FollowPage } from "~/components/Profile/FollowPage";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("followers"),
  };
}

export default function FollowersPage({
  params: { fullname, locale },
}: {
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return <FollowPage fullname={fullname} variant="followers" />;
}
