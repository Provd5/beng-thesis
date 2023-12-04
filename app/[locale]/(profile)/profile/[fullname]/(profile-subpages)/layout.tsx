import { unstable_setRequestLocale } from "next-intl/server";

import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { CategoryLinksContainer } from "~/components/ui/CategoryLinksContainer";
import { DragContainer } from "~/components/ui/DragContainer";
import { type localeTypes } from "~/i18n";

export default function ProfileSubpagesLayout({
  children,
  params: { fullname, locale },
}: {
  children: React.ReactNode;
  params: { fullname: string; locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <BackCategoryLink variant="RETURN" href={`../${fullname}`} />
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar gap-1"
      >
        <CategoryLinksContainer />
      </DragContainer>
      {children}
    </>
  );
}
