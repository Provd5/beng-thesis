import Link from "next/link";
import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";

import { AvatarImage } from "~/components/ui/AvatarImage";
import { ProfilePageContainer } from "~/components/ui/PageContainer";
import { db } from "~/lib/db";

import { getMessages, type PageProps } from "../../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("CategoryTitles.profile"),
  };
}

export default async function ProfilePage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const userData = await db.profile.findFirst({
    where: { full_name: fullname },
  });

  if (!userData) notFound();

  return (
    <ProfilePageContainer>
      <div className="container mx-auto">
        <div className="flex h-[115px] w-[115px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
          <AvatarImage size="lg" avatarSrc={userData.avatar_url} />
        </div>
        <div>{userData.full_name}</div>
        <Link href="/edit/username">edit username</Link>
      </div>
    </ProfilePageContainer>
  );
}
