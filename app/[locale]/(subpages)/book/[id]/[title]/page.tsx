import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/ManageBookshelf";
import { ManageLikes } from "~/components/Book/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/ManageReviews";
import { db } from "~/lib/db";

export default async function BookPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const book = await db.book.findFirst({
    where: { id: id },
    include: {
      review: true,
      liked_by: true,
      bookshelf: { where: { user_id: session?.user.id } },
      book_owned_as: { where: { user_id: session?.user.id } },
    },
  });

  if (!book) notFound();
  const bookshelfData =
    book.bookshelf.length > 0 ? book.bookshelf[0] : undefined;
  const ownedAsData =
    book.book_owned_as.length > 0 ? book.book_owned_as[0] : undefined;
  const liked = book.liked_by.find((user) => user.id === session?.user.id);
  const myReview = book.review.find(
    (review) => review.author_id === session?.user.id
  );

  return (
    <div className="container mx-auto py-10 text-sm font-normal">
      <div className="flex flex-col gap-8">
        <div className="flex gap-1 px-1 xs:gap-3 xs:px-3 md:px-6">
          <BookCover size="lg" coverUrl={book.thumbnail_url} />

          <div className="mt-0.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-medium">{book.title}</h1>
              {book.subtitle && <h2>{book.subtitle}</h2>}
            </div>

            <p className="text-black-light dark:text-white-dark">
              {book.authors.join(", ")}
            </p>

            <div className="flex flex-col">
              {book.publisher && (
                <BookDetails variant="publisher:">{book.publisher}</BookDetails>
              )}
              <BookDetails variant="release date:">
                {book.published_date}
              </BookDetails>
            </div>

            {book.page_count !== 0 ||
              (book.categories.length > 0 && (
                <div className="flex flex-col gap-1">
                  {book.page_count !== 0 && (
                    <BookDetails variant="pages:">
                      {book.page_count}
                    </BookDetails>
                  )}
                  {book.categories.length > 0 && (
                    <BookDetails variant="genre:">
                      {book.categories.join(", ")}
                    </BookDetails>
                  )}
                </div>
              ))}

            <BookDetails variant="averge score:">0/5</BookDetails>
          </div>
        </div>
        {!session ? (
          "Zaloguj się"
        ) : (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-5">
            <div className="flex max-w-[300px] flex-wrap items-start justify-center gap-x-8 gap-y-5 sm:justify-between">
              <ManageBookshelf
                bookshelf={bookshelfData?.bookshelf}
                title={bookshelfData?.title}
                updatedAt={bookshelfData?.updated_at}
              />
              <ManageOwnedAs
                addedEbookAt={ownedAsData?.added_ebook_at}
                addedAudiobookAt={ownedAsData?.added_audiobook_at}
                addedBookAt={ownedAsData?.added_book_at}
              />
            </div>
            <div className="flex max-w-[300px] flex-wrap items-start justify-center gap-x-8 gap-y-5 sm:justify-between">
              <ManageLikes liked={!!liked} quantity={book.liked_by.length} />
              <ManageReviews
                myReview={!!myReview}
                quantity={book.review.length}
                createdAt={myReview?.created_at}
              />
            </div>
          </div>
        )}
        {book.description && (
          <div>
            <h3 className="font-medium">Description:</h3>
            <p>{book.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
