import { Button, ButtonLink, ButtonWhite } from "~/components/ui/Buttons";
import { getTranslator, type Locale } from "~/dictionaries";

export default async function ExplorePage({
  params,
}: {
  params: { lang: Locale };
}) {
  const t = await getTranslator(params.lang);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <h1>{t.Explore.categoryTitle}</h1>
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
