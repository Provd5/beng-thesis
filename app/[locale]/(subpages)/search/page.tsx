import { createTranslator } from "next-intl";

import { getMessages, type PageProps } from "../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("CategoryTitles.search"),
  };
}

export default async function SearchPage({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);
  const t = createTranslator({ locale, messages });
  return (
    <>
      <div>{t("CategoryTitles.search")}</div>
    </>
  );
}
