import { type categoryTypes } from "~/types/categoryTypes";

import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileDescription } from "~/components/Profile/ProfileDescription";
import { Statistics } from "~/components/Profile/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { db } from "~/lib/db";

export default async function ProfilePage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const userData = await db.profile.findUnique({
    where: {
      full_name: fullname,
      private: { not: true },
    },
    select: {
      id: true,
      description: true,
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

  return userData ? (
    <>
      {userData.description && (
        <ProfileDescription description={userData.description} />
      )}
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
              <DragContainer>
                {variantQuantity > 0 ? (
                  <>
                    <CategoryContentCard
                      bookshelfVariant={bookshelfVariant}
                      userId={userData.id}
                    />
                    {variantQuantity > 10 && (
                      <CategoryContentCardPlaceholder href={`/${variantUrl}`} />
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
    </>
  ) : (
    <PrivateProfilePage />
  );
}
