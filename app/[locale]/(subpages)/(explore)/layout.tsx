import { unstable_setRequestLocale } from "next-intl/server";

import { SubpageNavbar } from "~/components/Explore/SubpageNavbar";
import { type localeTypes } from "~/i18n";

export default function ExploreLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <SubpageNavbar />
      {children}
    </>
  );
}
