import { notFound } from "next/navigation";

import { CategoryArray, type categoryTypes } from "~/types/categoryTypes";

import { BookCard } from "~/components/Explore/BookCard";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { db } from "~/lib/db";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";

type bookDataType = {
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
    review: {
      score: number;
    }[];
    _count: {
      review: number;
      liked_by: number;
    };
  };
};

export default async function BookshelfPage({
  params: { bookshelf, fullname },
}: {
  params: { bookshelf: string; fullname: string };
}) {
  const bookshelfAsType = convertPathnameToTypeEnum(bookshelf) as categoryTypes;

  if (!CategoryArray.includes(bookshelfAsType)) {
    notFound();
  }

  let books: bookDataType[] = [];

  const commonSelect = {
    book: {
      select: {
        id: true,
        title: true,
        authors: true,
        thumbnail_url: true,
        review: { select: { score: true } },
        _count: { select: { review: true, liked_by: true } },
      },
    },
  };

  switch (bookshelfAsType) {
    case "OWNED":
      books = await db.book_owned_as.findMany({
        orderBy: [
          { added_book_at: "desc" },
          { added_ebook_at: "desc" },
          { added_audiobook_at: "desc" },
        ],
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
        select: commonSelect,
      });
      break;
    case "LIKED":
      books = await db.liked_books.findMany({
        orderBy: { updated_at: "desc" },
        where: { profile: { full_name: fullname } },
        select: commonSelect,
      });
      break;
    case "REVIEWS":
      break;
    case "STATISTICS":
      break;
    default:
      books = await db.bookshelf.findMany({
        orderBy: { updated_at: "desc" },
        where: { bookshelf: bookshelfAsType, profile: { full_name: fullname } },
        select: commonSelect,
      });
      break;
  }

  return (
    <div className="flex flex-col gap-3">
      <BookshelfPageTitle
        booksQuantity={books.length}
        categoryVariant={bookshelfAsType}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {books?.map(({ book }) => {
          return <BookCard key={book.id} bookData={book} />;
        })}
      </div>
    </div>
  );
}
