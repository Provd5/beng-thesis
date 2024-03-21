import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

import { AuthPage } from "~/components/Auth/AuthPage";
import { SignupForm } from "~/components/Auth/SignupForm";
import { type localeTypes } from "~/i18n";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  const t = await getTranslations({ locale, namespace: "Nav.CategoryTitles" });
  return {
    title: t("signup"),
  };
}

export default function SignUpPage({
  params: { locale },
}: {
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <AuthPage view="signUp">
      <SignupForm />
    </AuthPage>
  );
}
