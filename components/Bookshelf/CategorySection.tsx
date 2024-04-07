import { type FC } from "react";

import { type BookshelvesTypes } from "~/types/consts";

import { getBookshelfPreview } from "~/lib/services/bookshelf";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

import { SmallBookCard } from "../Book/SmallBookCard";
import { CategoryLink } from "../Links/CategoryLink";
import { DragContainer } from "../ui/DragContainer";
import { CategoryContentCardPlaceholder } from "./CategoryContentCardPlaceholder";

interface CategorySectionProps {
  profileName: string;
  bookshelfVariant: BookshelvesTypes;
}

export const CategorySection: FC<CategorySectionProps> = async ({
  profileName,
  bookshelfVariant,
}) => {
  const books = await getBookshelfPreview(profileName, bookshelfVariant);

  const variantUrl = `${ROUTES.profile.bookshelf(
    profileName,
    convertTypeEnumToPathname(bookshelfVariant)
  )}`;

  return (
    <div className="flex flex-col gap-1">
      <>
        <CategoryLink
          bookshelfVariant={bookshelfVariant}
          href={variantUrl}
          allItems={books?.allItems}
        />
        <DragContainer
          arrowsClassName="mb-6"
          containerClassName="custom-scrollbar snap-x scroll-px-3 gap-3 px-3 pb-2 pt-0.5"
        >
          {books && books.allItems > 0 ? (
            <>
              {books.data.map((book) => (
                <SmallBookCard key={book.id} bookData={book} />
              ))}
              {books.allItems > 10 && (
                <CategoryContentCardPlaceholder href={variantUrl} />
              )}
            </>
          ) : (
            <CategoryContentCardPlaceholder href={ROUTES.root} isEmpty />
          )}
        </DragContainer>
      </>
    </div>
  );
};
