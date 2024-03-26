import { unstable_setRequestLocale } from "next-intl/server";

import { BackCategoryLink } from "~/components/Links/BackCategoryLink";
import { CategoryLinksContainer } from "~/components/Links/CategoryLinksContainer";
import { DragContainer } from "~/components/ui/DragContainer";
import { type localeTypes } from "~/i18n";
import ROUTES from "~/utils/routes";

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
      <BackCategoryLink variant="RETURN" href={ROUTES.profile.back(fullname)} />
      <DragContainer
        arrowSize="sm"
        containerClassName="flex-start py-1 px-0.5 hidden-scrollbar gap-1"
      >
        <CategoryLinksContainer profileName={fullname} />
      </DragContainer>
      {children}
    </>
  );
}
