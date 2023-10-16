import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryArray, type categoryTypes } from "~/types/categoryTypes";

import { BookCover } from "~/components/Book/BookCover";
import { BookshelfPageTitle } from "~/components/Profile/Bookshelf/BookshelfPageTitle";
import { db } from "~/lib/db";
import { convertPathnameToTypeEnum } from "~/utils/pathnameTypeEnumConverter";

type bookDataType = {
  book: {
    id: string;
    title: string;
    authors: string[];
    thumbnail_url: string | null;
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

  let bookData: bookDataType[] = [];

  const commonSelect = {
    book: {
      select: { id: true, title: true, authors: true, thumbnail_url: true },
    },
  };

  switch (bookshelfAsType) {
    case "OWNED":
      bookData = await db.book_owned_as.findMany({
        orderBy: [
          { added_book_at: "desc" },
          { added_ebook_at: "desc" },
          { added_audiobook_at: "desc" },
        ],
        where: { profile: { full_name: fullname } },
        select: commonSelect,
      });
      break;
    case "LIKED":
      bookData = await db.liked_books.findMany({
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
      bookData = await db.bookshelf.findMany({
        orderBy: { updated_at: "desc" },
        where: { bookshelf: bookshelfAsType, profile: { full_name: fullname } },
        select: commonSelect,
      });
      break;
  }

  return (
    <div className="flex flex-col gap-3">
      <BookshelfPageTitle
        booksQuantity={bookData.length}
        categoryVariant={bookshelfAsType}
      />
      <div className="flex flex-wrap gap-3">
        {bookData.map((data) => (
          <Link
            key={data.book.id}
            href={`/book/${data.book.id}/${data.book.title}`}
            className="flex w-32 flex-none snap-center flex-col items-center gap-1 py-0.5 md:snap-start"
          >
            <BookCover coverUrl={data.book.thumbnail_url} />
            <div className="self-start">
              <h1 className="line-clamp-2">{data.book.title}</h1>
              <p className="text-sm text-black-light dark:text-white-dark">
                {data.book.authors.join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
