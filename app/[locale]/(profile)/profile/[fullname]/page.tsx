import { CategoryArray } from "~/types/categoryTypes";

import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { PrivateProfilePage } from "~/components/Profile/PrivateProfilePage";
import { ProfileDescription } from "~/components/Profile/ProfileDescription";
import { Statistics } from "~/components/Profile/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { db } from "~/lib/db";
import { quantityPerCategoryType } from "~/utils/quantityPerCategoryType";

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

  const quantities = {
    ownedQuantity: userData?._count.book_owned_as,
    likedQuantity: userData?._count.liked_book,
    reviewsQuantity: userData?._count.review,
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
        {CategoryArray.map((categoryVariant) => {
          const variantUrl = `profile/${fullname}/${categoryVariant
            .toLocaleLowerCase()
            .replace("_", "-")}`;
          const variantQuantity = quantityPerCategoryType(
            categoryVariant,
            userData.bookshelf,
            quantities
          );
          return (
            <div key={categoryVariant} className="flex flex-col gap-1">
              <CategoryLink
                variant={categoryVariant}
                href={`/${variantUrl}`}
                quantity={variantQuantity}
              />
              <DragContainer>
                {variantQuantity > 0 ? (
                  <>
                    <CategoryContentCard
                      categoryVariant={categoryVariant}
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
