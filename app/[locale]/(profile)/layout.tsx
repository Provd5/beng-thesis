import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AccountSettings } from "~/components/Modals/AccountSettings";
import { Settings } from "~/components/Modals/Settings";
import { ProfilePageContainer } from "~/components/ui/PageContainer";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

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

  if (!session?.user) {
    redirect(`/login`);
  }

  const userData = await db.profile.findUnique({
    where: { id: session.user.id },
    select: { full_name: true, avatar_url: true },
  });

  // eslint-disable-next-line @typescript-eslint/require-await
  const setLangCookie = async (data: localeTypes) => {
    "use server";
    cookies().set("lang", data);
  };

  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden">
      <div className="absolute right-4 top-3 text-white md:right-6 md:top-5">
        <div className="flex gap-3">
          <AccountSettings
            userFullname={userData?.full_name}
            userAvatarUrl={userData?.avatar_url}
          />
          <Settings setLangCookie={setLangCookie} />
        </div>
      </div>
      <ProfilePageContainer>
        <div className="container pb-6">{children}</div>
      </ProfilePageContainer>
    </main>
  );
}
