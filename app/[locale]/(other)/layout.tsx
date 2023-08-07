import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Settings } from "~/components/Modals/Settings";
import { defaultLocale, type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const userData = await db.profile.findFirst({
      where: { id: session.user.id },
      select: { full_name: true },
    });

    redirect(`/profile/${userData?.full_name || ""}`);
  }

  const currentLang = (cookies().get("lang")?.value ||
    defaultLocale) as localeTypes;
  // eslint-disable-next-line @typescript-eslint/require-await
  const setLangCookie = async (data: localeTypes) => {
    "use server";
    cookies().set("lang", data);
  };

  return (
    <main className="nav-padding relative flex h-full flex-col text-xl text-white-light">
      {children}
      <div className="absolute right-4 top-3 md:right-6 md:top-5">
        <Settings currentLang={currentLang} setLangCookie={setLangCookie} />
      </div>
    </main>
  );
}
