import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { categoryArray, type CategoryTypes } from "~/types/CategoryTypes";

import { BooksFeed } from "~/components/Feed/BooksFeed";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { db } from "~/lib/db";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";

export default async function BookshelfPage({
  params: { bookshelf, fullname },
}: {
  params: { bookshelf: string; fullname: string };
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const bookshelfAsType = convertPathnameToTypeEnum(bookshelf) as CategoryTypes;

  if (!categoryArray.includes(bookshelfAsType)) {
    notFound();
  }

  let booksQuantity;
  let variant;
  switch (bookshelfAsType) {
    case "OWNED":
      booksQuantity = await db.book_owned_as.count({
        where: {
          profile: { full_name: fullname },
          NOT: {
            AND: [
              { added_audiobook_at: null },
              { added_book_at: null },
              { added_ebook_at: null },
            ],
          },
        },
      });
      variant = bookshelfAsType;
      break;
    case "LIKED":
      booksQuantity = await db.liked_books.count({
        where: { profile: { full_name: fullname } },
      });
      variant = bookshelfAsType;
      break;
    case "REVIEWS":
      booksQuantity = await db.review.count({
        where: { profile: { full_name: fullname } },
      });
      variant = bookshelfAsType;
      break;
    case "STATISTICS":
      break;
    default:
      booksQuantity = await db.bookshelf.count({
        where: { bookshelf: bookshelfAsType, profile: { full_name: fullname } },
      });
      variant = bookshelfAsType;
      break;
  }

  return (
    <div className="flex flex-col gap-3">
      <BookshelfPageTitle
        booksQuantity={booksQuantity || 0}
        categoryVariant={bookshelfAsType}
      />
      {variant &&
        (variant === "REVIEWS" ? (
          <BooksFeed variant="REVIEWS" profileName={fullname} />
        ) : (
          <BooksFeed
            userId={session?.user.id}
            profileName={fullname}
            variant={variant}
          />
        ))}
    </div>
  );
}
