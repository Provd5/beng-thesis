import { cookies } from "next/headers";
import { createTranslator } from "next-intl";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { LogoutButton } from "~/components/LogoutButton";
import { AvatarImage } from "~/components/ui/AvatarImage";

import { getMessages, type PageProps } from "../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("CategoryTitles.profile"),
  };
}

export default async function ProfilePage() {
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
      <LogoutButton />
    </div>
  );
}
