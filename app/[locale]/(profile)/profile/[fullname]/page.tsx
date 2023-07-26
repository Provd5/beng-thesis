import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { Statistics } from "~/components/Profile/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
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
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const publicUserData = await db.profile.findFirst({
    where: { full_name: fullname },
    select: { id: true, avatar_url: true, private: true, full_name: true },
  });
  if (!publicUserData) notFound();

  const userData = await db.profile.findFirst({
    where: {
      OR: [{ id: session?.user.id }, { id: publicUserData.id, private: false }],
    },
    include: {
      followed_by: true,
      following: true,
      review: true,
      liked_books: true,
      bookshelf: true,
      book_owned_as: true,
    },
  });

  return (
    <ProfilePageContainer>
      <div className="container mx-auto pb-3">
        <div className="mb-6 flex gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
              <AvatarImage size="lg" avatarSrc={publicUserData.avatar_url} />
              <ProfileStatus isPrivate={publicUserData.private} />
            </div>
          </div>
          <div>
            <h1 className="mx-0.5 my-2 bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {publicUserData.full_name}
            </h1>
            <FollowLinks
              followers={userData?.followed_by.length ?? 0}
              following={userData?.following.length ?? 0}
              reviews={userData?.review.length ?? 0}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <CategoryLink variant="statistics" />
          <Statistics />
          <CategoryLink variant="owned" />
          <CategoryLink variant="liked" />
          <CategoryLink variant="reading" />
          <CategoryLink variant="to-read" />
          <CategoryLink variant="already-read" />
          <CategoryLink variant="abandoned" />
          <CategoryLink variant="reviews" />
        </div>
      </div>
    </ProfilePageContainer>
  );
}
