import { type Locale } from "next/dist/compiled/@vercel/og/satori";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { ProfilePageContainer } from "~/components/ui/PageContainer";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
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

  return <ProfilePageContainer>{children}</ProfilePageContainer>;
}
