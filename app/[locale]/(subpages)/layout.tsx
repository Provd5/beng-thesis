import { Suspense } from "react";
import { unstable_setRequestLocale } from "next-intl/server";

import { Badges } from "~/components/Links/Badges";
import { Logo } from "~/components/Logo";
import { Loader } from "~/components/ui/Loaders/Loader";
import { type localeTypes } from "~/i18n";

export default function SubpagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-scroll scroll-smooth">
      <Logo />
      <div className="flex h-12 flex-none items-center self-end px-3 text-white">
        <Suspense fallback={<Loader />}>
          <Badges />
        </Suspense>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-colors-background md:rounded-none">
        {children}
      </div>
    </main>
  );
}
