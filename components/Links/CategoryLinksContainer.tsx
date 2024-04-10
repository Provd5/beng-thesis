"use client";

import { type FC, type TransitionStartFunction, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { BookshelvesArray, type BookshelvesTypes } from "~/types/consts";

import { cn } from "~/utils/cn";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";

import { BookmarkIcon } from "../ui/Icons/BookmarkIcon";
import { OwnedBookIcon } from "../ui/Icons/OwnedBookIcon";

interface CategoryLinksContainerProps {
  currentBookshelf: BookshelvesTypes;
  startTransition: TransitionStartFunction;
}

export const CategoryLinksContainer: FC<CategoryLinksContainerProps> = ({
  currentBookshelf,
  startTransition,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const ref = useRef<HTMLButtonElement>(null);

  const changeBookshelf = (bookshelf: string) => {
    params.set("bookshelf", bookshelf);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return BookshelvesArray.map((bookshelfVariant) => {
    const bookshelfVariantAsPathname =
      convertTypeEnumToPathname(bookshelfVariant);

    const isActive = currentBookshelf === bookshelfVariant;

    return (
      <>
        <button
          key={bookshelfVariant}
          ref={ref}
          onClick={() => changeBookshelf(bookshelfVariantAsPathname)}
          className={cn(
            "flex items-center gap-2 whitespace-nowrap rounded-xl border border-colors-primary px-5 py-2 text-sm transition-colors",
            isActive
              ? "cursor-default bg-colors-primary text-white"
              : "text-colors-primary hover:bg-colors-primary/70 hover:text-white"
          )}
        >
          {bookshelfVariant === "OWNED" ? (
            <OwnedBookIcon ownedAs="BOOK" size="sm" />
          ) : (
            <BookmarkIcon category={bookshelfVariant} />
          )}
          {t(bookshelfVariant)}
        </button>
      </>
    );
  });
};
