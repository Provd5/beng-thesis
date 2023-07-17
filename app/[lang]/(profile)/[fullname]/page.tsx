import { type Metadata } from "next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { LogoutButton } from "~/components/LogoutButton";
import { AvatarImage } from "~/components/ui/AvatarImage";
import { getTranslator } from "~/dictionaries";

import { type PageProps } from "../../layout";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { Profile } = await getTranslator(params.lang);
  const title = Profile.categoryTitle;
  return {
    title: title,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { Other } = await getTranslator(params.lang);

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user:", user);

  return (
    <div className="container mx-auto">
      <div className="flex h-[115px] w-[115px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
        <AvatarImage className="h-[100px] w-[100px]" />
      </div>
      <div>ProfilePage</div>
      <LogoutButton text={Other.Logout} />
    </div>
  );
}
