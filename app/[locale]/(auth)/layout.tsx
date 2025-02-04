import { Logo } from "~/components/Logo";
import { Settings } from "~/components/Modals/Settings";
import { type localeTypes, redirect } from "~/i18n/routing";
import { getSessionUser } from "~/lib/services/session/queries";
import ROUTES from "~/utils/routes";

export default async function AuthLayout({
  params,
  children,
}: {
  params: { locale: localeTypes };
  children: React.ReactNode;
}) {
  const { locale } = await params;
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect({ href: ROUTES.profile.session_profile, locale });
  }

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
