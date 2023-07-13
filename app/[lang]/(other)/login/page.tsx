import { type Metadata } from "next";

import { AuthPage } from "~/components/Auth/AuthPage";
import { getTranslator } from "~/dictionaries";

import { type PageProps } from "../../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Login } = await getTranslator(params.lang);
  const title = Login.categoryTitle;
  return {
    title: title,
  };
}

export default function LoginPage({ params }: PageProps) {
  return <AuthPage params={params} view="logIn" />;
}
