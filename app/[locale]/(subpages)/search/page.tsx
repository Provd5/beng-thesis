import { createTranslator } from "next-intl";

import { Button, ButtonLink, ButtonWhite } from "~/components/ui/Buttons";

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
      <div className="flex flex-col items-center gap-3">
        <h1>{"categoryTitle"}</h1>
        <ButtonWhite>TEST test Test</ButtonWhite>
        <ButtonWhite size="sm">TEST test Test</ButtonWhite>
        <ButtonWhite loading>TEST test Test</ButtonWhite>
        <Button>TEST test Test</Button>
        <Button size="sm">TEST test Test</Button>
        <Button loading>TEST test Test</Button>
        <ButtonLink>TEST test Test</ButtonLink>
        <ButtonLink size="sm" active>
          TEST test Test
        </ButtonLink>
        <ButtonLink loading>TEST test Test</ButtonLink>
      </div>
    </>
  );
}
