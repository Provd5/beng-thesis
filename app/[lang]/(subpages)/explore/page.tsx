import { type Metadata } from "next";

import { Button, ButtonLink, ButtonWhite } from "~/components/ui/Buttons";
import { getTranslator } from "~/dictionaries";

import { type PageProps } from "../../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Explore } = await getTranslator(params.lang);
  const title = Explore.categoryTitle;
  return {
    title: title,
  };
}

export default async function ExplorePage({ params }: PageProps) {
  const { Explore } = await getTranslator(params.lang);

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <h1>{Explore.categoryTitle}</h1>
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
