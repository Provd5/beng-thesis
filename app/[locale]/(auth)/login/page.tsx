import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AuthPage } from "~/components/Auth/AuthPage";
import { DemoLogin } from "~/components/Auth/DemoLogin";
import { type localeTypes } from "~/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeTypes }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("login"),
  };
}

export default function LoginPage({}) {
  return (
    <>
      <AuthPage view="logIn" />
      <DemoLogin />
    </>
  );
}
