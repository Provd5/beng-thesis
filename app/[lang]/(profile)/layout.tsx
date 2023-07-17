import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AccountSettings } from "~/components/AccountSettings";
import { Settings } from "~/components/Settings";

import { type PageProps } from "../layout";

export default async function ProfileLayout({
  children,
  params,
}: PageProps & {
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

  return (
    <div className="relative flex h-full flex-col">
      {children}
      <div className="absolute right-4 top-3 text-white md:right-6 md:top-5">
        <div className="flex gap-3">
          <AccountSettings params={params} />
          <Settings params={params} />
        </div>
      </div>
    </div>
  );
}
