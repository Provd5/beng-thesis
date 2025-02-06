import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AuthPage } from "~/components/Auth/AuthPage";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: localeTypes };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("signup"),
  };
}

export default function SignUpPage({}) {
  return <AuthPage view="signUp" />;
}
