import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Settings } from "~/components/Settings";

import { type PageProps } from "../layout";

export default async function ProfileLayout({
  children,
  params,
}: PageProps & {
  children: React.ReactNode;
}) {
  // const t = await getTranslator(params.lang);
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(`/`);
  }

  return (
    <main className="nav-padding relative flex h-full flex-col text-xl text-white-light">
      {children}
      <Settings params={params} />
    </main>
  );
}
