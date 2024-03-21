import { type FC, Suspense } from "react";

import { type CategoriesTypes } from "~/types/data/bookshelf";

import { BookshelfService } from "~/lib/services/bookshelf";
import ROUTES from "~/utils/routes";

import { SmallBookCard } from "../Book/SmallBookCard";
import { CategoryLink } from "../Links/CategoryLink";
import { Statistics } from "../Profile/Statistics/Statistics";
import { DragContainer } from "../ui/DragContainer";
import { SmallBookCardsLoader } from "../ui/Loaders/Skeletons/SmallBookCardLoader";
import { CategoryContentCardPlaceholder } from "./CategoryContentCardPlaceholder";

interface CategorySectionProps {
  profileName: string;
  categoryVariant: CategoriesTypes;
}

export const CategorySection: FC<CategorySectionProps> = async ({
  profileName,
  categoryVariant,
}) => {
  const bookshelfService = new BookshelfService();

  const books =
    categoryVariant !== "STATISTICS"
      ? await bookshelfService.getBookshelfPreview(profileName, categoryVariant)
      : null;

  const variantUrl = ROUTES.profile.bookshelf(categoryVariant);

  return (
    <div className="flex flex-col gap-1">
      {categoryVariant === "STATISTICS" ? (
        <>
          <CategoryLink categoryVariant="STATISTICS" href={variantUrl} />
          <Statistics profileName={profileName} />
        </>
      ) : (
        <>
          <CategoryLink
            categoryVariant={categoryVariant}
            href={variantUrl}
            allItems={books?.allItems}
          />
          <DragContainer
            arrowsClassName="mb-6"
            containerClassName="custom-scrollbar snap-x scroll-px-3 gap-3 px-3 pb-2 pt-0.5"
          >
            {books && books.allItems > 0 ? (
              <>
                <Suspense
                  fallback={<SmallBookCardsLoader items={books.allItems} />}
                >
                  {books.data.map((book) => (
                    <SmallBookCard key={book.id} bookData={book} />
                  ))}
                </Suspense>
                {books.allItems > 10 && (
                  <CategoryContentCardPlaceholder href={variantUrl} />
                )}
              </>
            ) : (
              <CategoryContentCardPlaceholder href={ROUTES.root} isEmpty />
            )}
          </DragContainer>
        </>
      )}
    </div>
  );
};
