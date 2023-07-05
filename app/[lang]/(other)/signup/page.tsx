import { type Locale } from "next/dist/compiled/@vercel/og/satori";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AuthForm } from "~/components/AuthForm";

export default async function LoginPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(`/profile`);
    // redirect(`/${params.lang}/profile`);
  }

  return <AuthForm view="signUp" />;
}
