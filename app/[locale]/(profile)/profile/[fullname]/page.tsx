import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createTranslator } from "next-intl";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { Statistics } from "~/components/Profile/Statistics";
import { CategoryLink, type categoryTypes } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { ProfilePageContainer } from "~/components/ui/PageContainer";
import { db } from "~/lib/db";

import { getMessages, type PageProps } from "../../../layout";

export async function generateMetadata({ params: { locale } }: PageProps) {
  const messages = await getMessages(locale);

  const t = createTranslator({ locale, messages });

  return {
    title: t("Nav.CategoryTitles.profile"),
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

  if (!publicUserData || !session?.user) notFound();

  const userData = await db.profile.findFirst({
    where: {
      OR: [{ id: session.user.id }, { id: publicUserData.id, private: false }],
    },
    select: {
      id: true,
      _count: {
        select: {
          followed_by: true,
          following: true,
          book_owned_as: true,
          liked_book: true,
          review: true,
        },
      },
      bookshelf: { select: { bookshelf: true } },
    },
  });

  const CategoryArray: categoryTypes[] = [
    "OWNED",
    "LIKED",
    "ALREADY_READ",
    "TO_READ",
    "ABANDONED",
    "READING",
    "OTHER",
    "REVIEWS",
  ];

  const quantityPerVariant = (bookshelfVariant: categoryTypes): number => {
    switch (bookshelfVariant) {
      case "OWNED":
        return userData?._count.book_owned_as || 0;
      case "LIKED":
        return userData?._count.liked_book || 0;
      case "REVIEWS":
        return userData?._count.review || 0;
      default:
        return (
          userData?.bookshelf.filter(
            (variant) => variant.bookshelf === bookshelfVariant
          ).length || 0
        );
    }
  };

  return (
    <ProfilePageContainer>
      <div className="container mx-auto pb-3">
        <div className="mb-6 flex gap-1 xs:gap-3">
          <div className="ml-0 mt-[-30px] xs:ml-6">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-light dark:bg-gradient-dark">
              <AvatarImage size="lg" avatarSrc={publicUserData.avatar_url} />
              <ProfileStatus isPrivate={publicUserData.private} />
            </div>
          </div>
          <div>
            <h1 className="mx-0.5 my-2 break-all bg-gradient-dark bg-clip-text text-xl font-semibold text-transparent dark:bg-gradient-light">
              {publicUserData.full_name}
            </h1>
            {userData && (
              <FollowLinks
                followers={userData._count.followed_by}
                following={userData._count.following}
                reviews={userData._count.review}
              />
            )}
          </div>
        </div>
        {userData && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <CategoryLink variant="STATISTICS" href={"/statistics"} />
              <Statistics />
            </div>
            {CategoryArray.map((bookshelfVariant) => (
              <div key={bookshelfVariant} className="flex flex-col gap-1">
                <CategoryLink
                  variant={bookshelfVariant}
                  href={`/${bookshelfVariant
                    .toLocaleLowerCase()
                    .replace("_", "-")}`}
                  quantity={quantityPerVariant(bookshelfVariant)}
                />
                <DragContainer>
                  {quantityPerVariant(bookshelfVariant) > 0 ? (
                    <CategoryContentCard
                      bookshelfVariant={bookshelfVariant}
                      userId={userData.id}
                    />
                  ) : (
                    <CategoryContentCardPlaceholder />
                  )}
                </DragContainer>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfilePageContainer>
  );
}
