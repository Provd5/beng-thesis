import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AccountSettings } from "~/components/AccountSettings";
import { Settings } from "~/components/Settings";
import { defaultLocale, type localeTypes } from "~/i18n";

export default async function ProfileLayout({
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

  if (!session) {
    redirect(`/login`);
  }

  const currentLang = (cookies().get("lang")?.value ??
    defaultLocale) as localeTypes;
  // eslint-disable-next-line @typescript-eslint/require-await
  const setLangCookie = async (data: localeTypes) => {
    "use server";
    cookies().set("lang", data);
  };

  return (
    <div className="relative flex h-full flex-col">
      {children}
      <div className="absolute right-4 top-3 text-white md:right-6 md:top-5">
        <div className="flex gap-3">
          <AccountSettings />
          <Settings currentLang={currentLang} setLangCookie={setLangCookie} />
        </div>
      </div>
    </div>
  );
}
