import { type FC, Suspense } from "react";

import { type CategoryTypes } from "~/types/CategoryTypes";

import {
  fetchBooks,
  fetchBooksInCategoryCount,
} from "~/lib/actions/feed/books";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";

import { SmallBookCard } from "../Explore/SmallBookCard";
import { CategoryLink } from "../ui/CategoryLink";
import { DragContainer } from "../ui/DragContainer";
import { SmallBookCardsLoader } from "../ui/Loaders/Skeletons/SmallBookCardLoader";
import { CategoryContentCardPlaceholder } from "./CategoryContentCardPlaceholder";
import { Statistics } from "./Statistics/Statistics";

interface CategorySectionProps {
  categoryVariant: CategoryTypes;
  fullname: string;
}

export const CategorySection: FC<CategorySectionProps> = async ({
  categoryVariant,
  fullname,
}) => {
  const [books, variantCount] = await Promise.all([
    fetchBooks(categoryVariant, fullname, {}),
    fetchBooksInCategoryCount(categoryVariant, fullname),
  ]);

  const variantUrl = `${fullname}/${convertTypeEnumToPathname(
    categoryVariant
  )}`;

  return (
    <div className="flex flex-col gap-1">
      {categoryVariant === "STATISTICS" ? (
        <>
          <CategoryLink variant="STATISTICS" href={`${fullname}/statistics`} />
          <Statistics fullname={fullname} />
        </>
      ) : (
        <>
          <CategoryLink
            variant={categoryVariant}
            href={variantUrl}
            quantity={variantCount}
          />
          <DragContainer
            arrowsClassName="mb-6"
            containerClassName="custom-scrollbar snap-x scroll-px-3 gap-3 px-3 pb-2 pt-0.5"
          >
            {variantCount > 0 ? (
              <>
                <Suspense
                  fallback={<SmallBookCardsLoader items={variantCount} />}
                >
                  {(books as BookCardInterface[]).map(({ book }) => (
                    <SmallBookCard key={book.id} book={book} />
                  ))}
                </Suspense>
                {variantCount > 10 && (
                  <CategoryContentCardPlaceholder href={variantUrl} />
                )}
              </>
            ) : (
              <CategoryContentCardPlaceholder href="/" isEmpty />
            )}
          </DragContainer>
        </>
      )}
    </div>
  );
};
