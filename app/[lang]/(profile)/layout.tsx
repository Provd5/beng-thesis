import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Settings } from "~/components/Settings";
import { ProfilePageContainer } from "~/components/ui/PageContainer";

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
    <ProfilePageContainer>
      {children}
      <Settings params={params} />
    </ProfilePageContainer>
  );
}
