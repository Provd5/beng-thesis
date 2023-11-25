import { unstable_setRequestLocale } from "next-intl/server";

import { Logo } from "~/components/Logo";
import { Settings } from "~/components/Modals/Settings";
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
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-scroll">
      <Logo />
      <div className="flex h-12 flex-none items-center self-end px-3 text-white">
        <div className="h-fit">
          <Settings />
        </div>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        {children}
      </div>
    </main>
  );
}
