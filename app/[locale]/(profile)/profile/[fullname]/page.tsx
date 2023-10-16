import { notFound } from "next/navigation";

import { CategoryArray } from "~/types/categoryTypes";

import { CategoryContentCard } from "~/components/Profile/CategoryContentCard";
import { CategoryContentCardPlaceholder } from "~/components/Profile/CategoryContentCardPlaceholder";
import { ProfileDescription } from "~/components/Profile/ProfileDescription";
import { Statistics } from "~/components/Profile/Statistics/Statistics";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { DragContainer } from "~/components/ui/DragContainer";
import { db } from "~/lib/db";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import { quantityPerCategoryType } from "~/utils/quantityPerCategoryType";

export default async function ProfilePage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  const userData = await db.profile.findUnique({
    where: {
      full_name: fullname,
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

  if (!userData) notFound();

  const quantities = {
    ownedQuantity: userData?._count.book_owned_as,
    likedQuantity: userData?._count.liked_book,
    reviewsQuantity: userData?._count.review,
  };

  return (
    <>
      {userData.description && (
        <ProfileDescription description={userData.description} />
      )}
      <div className="mt-6 flex flex-col gap-3">
        {CategoryArray.map((categoryVariant) => {
          const variantUrl = `profile/${fullname}/${convertTypeEnumToPathname(
            categoryVariant
          )}`;
          const variantQuantity = quantityPerCategoryType(
            categoryVariant,
            userData.bookshelf,
            quantities
          );

          return (
            <div key={categoryVariant} className="flex flex-col gap-1">
              {categoryVariant === "STATISTICS" ? (
                <>
                  <CategoryLink
                    variant="STATISTICS"
                    href={`/profile/${fullname}/statistics`}
                  />
                  <Statistics userId={userData.id} userFullname={fullname} />
                </>
              ) : (
                <>
                  <CategoryLink
                    variant={categoryVariant}
                    href={`/${variantUrl}`}
                    quantity={variantQuantity}
                  />
                  <DragContainer
                    arrowsClassName="mb-6"
                    containerClassName="custom-scrollbar flex snap-x scroll-px-3 gap-3 px-3 pb-2 pt-0.5"
                  >
                    {variantQuantity > 0 ? (
                      <>
                        <CategoryContentCard
                          categoryVariant={categoryVariant}
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
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
