import { Suspense } from "react";

import { Badges } from "~/components/Links/Badges";
import { Logo } from "~/components/Logo";
import { Loader } from "~/components/ui/Loaders/Loader";
import { type localeTypes, redirect } from "~/i18n/routing";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

export default async function ProfileLayout({
  params,
  children,
}: {
  params: { locale: localeTypes };
  children: React.ReactNode;
}) {
  const { locale } = await params;
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect({ href: ROUTES.auth.login, locale });
  }

  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-scroll scroll-smooth">
      <Logo />
      <div className="flex h-[68px] flex-none self-end p-3 text-white">
        <Suspense key={"Badges"} fallback={<Loader />}>
          <Badges />
        </Suspense>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        <div className="container pb-12">{children}</div>
      </div>
    </main>
  );
}
