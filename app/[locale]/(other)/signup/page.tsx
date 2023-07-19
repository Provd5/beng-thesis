import { createTranslator } from "next-intl";

import { AuthPage } from "~/components/Auth/AuthPage";

import { getMessages, type PageProps } from "../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("CategoryTitles.signup"),
  };
}

export default function LoginPage() {
  return <AuthPage view="signUp" />;
}
