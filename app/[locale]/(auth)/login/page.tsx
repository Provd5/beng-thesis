import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AuthPage } from "~/components/Auth/AuthPage";
import { LoginForm } from "~/components/Auth/LoginForm";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("login"),
  };
}

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <AuthPage view="logIn">
      <LoginForm />
    </AuthPage>
  );
}
