import { type Metadata } from "next";

import { LogoutButton } from "~/components/LogoutButton";
import { getTranslator } from "~/dictionaries";

import { type PageProps } from "../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Profile } = await getTranslator(params.lang);

  return {
    title: `${Profile.categoryTitle} | Being Thesis`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { Other } = await getTranslator(params.lang);

  return (
    <>
      <div>ProfilePage</div>
      <LogoutButton text={Other.Logout} />
    </>
  );
}
