import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AuthPage } from "~/components/Auth/AuthPage";
import { getTranslator } from "~/dictionaries";

import { type PageProps } from "../../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Login } = await getTranslator(params.lang);

  return {
    title: `${Login.categoryTitle} | Being Thesis`,
  };
}

export default async function LoginPage({ params }: PageProps) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(`/`);
  }

  return <AuthPage params={params} view="logIn" />;
}
