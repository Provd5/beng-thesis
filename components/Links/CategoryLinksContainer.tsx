"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { BookshelvesArray } from "~/types/consts";

import { cn } from "~/utils/cn";
import { convertTypeEnumToPathname } from "~/utils/pathnameTypeEnumConverter";
import ROUTES from "~/utils/routes";

interface CategoryLinksContainerProps {
  profileName: string;
}

export const CategoryLinksContainer: FC<CategoryLinksContainerProps> = ({
  profileName,
}) => {
  const t = useTranslations("Book.BookshelfTypes");

  const pathname = usePathname();
  const pathnameParts = pathname.split("/");

  return BookshelvesArray.map((bookshelfVariant) => {
    const categoryVariantAsPathname =
      convertTypeEnumToPathname(bookshelfVariant);
    const isActive = () => {
      if (pathnameParts[4] === categoryVariantAsPathname) return true;

      return false;
    };

    return (
      <Link
        key={bookshelfVariant}
        replace
        href={ROUTES.profile.bookshelf(
          profileName,
          convertTypeEnumToPathname(bookshelfVariant)
        )}
        className={cn(
          "whitespace-nowrap rounded-xl border border-colors-primary px-5 py-2.5 text-sm transition-colors",
          isActive()
            ? "cursor-default bg-colors-primary text-white"
            : "text-colors-primary hover:bg-colors-primary/70 hover:text-white"
        )}
      >
        {t(bookshelfVariant)}
      </Link>
    );
  });
};
