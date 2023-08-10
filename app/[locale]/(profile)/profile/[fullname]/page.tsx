import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { type categoryTypes } from "~/types/categoryTypes";

import { AvatarImage } from "~/components/Profile/AvatarImage";
import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { FollowLinks } from "~/components/Profile/FollowLinks";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileDescription } from "~/components/Profile/ProfileDescription";
import { ProfileStatus } from "~/components/Profile/ProfileStatus";
import { Statistics } from "~/components/Profile/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { db } from "~/lib/db";

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

  const [publicUserData, myFullname] = await Promise.all([
    db.profile.findUnique({
      where: { full_name: fullname },
      select: {
        id: true,
        avatar_url: true,
        private: true,
        full_name: true,
        description: true,
      },
    }),
    session?.user &&
      db.profile.findUnique({
        where: { id: session.user.id },
        select: { id: true, full_name: true },
      }),
  ]);

  if (!publicUserData?.full_name || !myFullname?.full_name) notFound();

  const commonSelect = {
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
  };

  const userData =
    publicUserData.full_name === myFullname.full_name
      ? await db.profile.findUnique({
          where: {
            id: myFullname.id,
          },
          select: commonSelect,
        })
      : await db.profile.findUnique({
          where: {
            id: publicUserData.id,
            private: false,
          },
          select: commonSelect,
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
    <>
      <div className="flex gap-1 xs:gap-3">
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
      {publicUserData.description && (
        <ProfileDescription description={publicUserData.description} />
      )}
      {userData ? (
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <CategoryLink
              variant="STATISTICS"
              href={`/profile/${fullname}/statistics`}
            />
            <Statistics />
          </div>
          {CategoryArray.map((bookshelfVariant) => {
            const variantUrl = `profile/${fullname}/${bookshelfVariant
              .toLocaleLowerCase()
              .replace("_", "-")}`;
            const variantQuantity = quantityPerVariant(bookshelfVariant);
            return (
              <div key={bookshelfVariant} className="flex flex-col gap-1">
                <CategoryLink
                  variant={bookshelfVariant}
                  href={`/${variantUrl}`}
                  quantity={variantQuantity}
                />
                <DragContainer itemsQuantity={variantQuantity}>
                  {variantQuantity > 0 ? (
                    <>
                      <CategoryContentCard
                        bookshelfVariant={bookshelfVariant}
                        userId={userData.id}
                      />
                      {variantQuantity > 10 && (
                        <CategoryContentCardPlaceholder
                          href={`/${variantUrl}`}
                        />
                      )}
                    </>
                  ) : (
                    <CategoryContentCardPlaceholder href="/explore" isEmpty />
                  )}
                </DragContainer>
              </div>
            );
          })}
        </div>
      ) : (
        <PrivateProfilePage />
      )}
    </>
  );
}
