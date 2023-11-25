import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { Logo } from "~/components/Logo";
import { Settings } from "~/components/Modals/Settings";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: localeTypes };
}) {
  unstable_setRequestLocale(locale);

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const userData = await db.profile.findUnique({
      where: { id: session.user.id },
      select: { full_name: true },
    });

    redirect(
      userData?.full_name ? `/profile/${userData.full_name}` : "/edit-profile"
    );
  }

  return (
    <main className="nav-padding relative flex h-full flex-col overflow-x-hidden text-xl text-white-light">
      {children}
      <div className="absolute right-4 top-3 md:right-6 md:top-5">
        <Settings />
      </div>
      <Logo />
    </main>
  );
}
