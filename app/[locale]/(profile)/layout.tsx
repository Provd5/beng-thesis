import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";

import { Logo } from "~/components/Logo";
import { AccountSettings } from "~/components/Modals/AccountSettings";
import { Settings } from "~/components/Modals/Settings";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function ProfileLayout({
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

  if (!session?.user) {
    redirect(`/login`);
  }

  const userData = await db.profile.findUnique({
    where: { id: session.user.id },
    select: { full_name: true, avatar_url: true },
  });

  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-scroll">
      <Logo />
      <div className="flex h-[68px] flex-none self-end p-3 text-white">
        <div className="flex h-fit gap-3">
          <AccountSettings
            userFullname={userData?.full_name}
            userAvatarUrl={userData?.avatar_url}
          />
          <Settings />
        </div>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        <div className="container pb-12">{children}</div>
      </div>
    </main>
  );
}
