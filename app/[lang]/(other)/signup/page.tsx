import { type Metadata } from "next";

import { AuthPage } from "~/components/Auth/AuthPage";
import { getTranslator, type Locale } from "~/dictionaries";

import { type PageProps } from "../../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Signup } = await getTranslator(params.lang);
  const title = Signup.categoryTitle;

  return {
    title: title,
  };
}

export default function LoginPage({ params }: { params: { lang: Locale } }) {
  return <AuthPage params={params} view="signUp" />;
}
