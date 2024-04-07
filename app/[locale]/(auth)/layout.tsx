import { unstable_setRequestLocale } from "next-intl/server";

import { Logo } from "~/components/Logo";
import { Settings } from "~/components/Modals/Settings";
import { type localeTypes } from "~/i18n";

export default function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  return (
    <main className="nav-padding grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-hidden text-xl text-white">
      {children}
      <div className="absolute right-4 top-3 md:right-6 md:top-5">
        <Settings />
      </div>
      <Logo />
    </main>
  );
}
