import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/ManageBookshelf";
import { ManageLikes } from "~/components/Book/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/ManageReviews";
import { Review } from "~/components/Book/Review";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { db } from "~/lib/db";
import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

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
      liked_by: { select: { id: true } },
      bookshelf: session ? { where: { user_id: session.user.id } } : false,
      book_owned_as: session ? { where: { user_id: session.user.id } } : false,
    },
  });

  if (!book) notFound();
  const bookshelfData = book.bookshelf ? book.bookshelf[0] : undefined;
  const ownedAsData = book.book_owned_as ? book.book_owned_as[0] : undefined;
  const liked = book.liked_by.some(
    (profile) => profile.id === session?.user.id
  );

  const bookReviews = await db.review.findMany({
    where: { book_id: book.id },
    include: {
      review_reaction: true,
      profile: {
        select: {
          avatar_url: true,
          full_name: true,
          created_at: true,
          _count: {
            select: {
              bookshelf: { where: { bookshelf: { equals: "ALREADY_READ" } } },
              review: true,
            },
          },
        },
      },
    },
  });
  console.log(...bookReviews);

  const myReview = bookReviews.find(
    (review) => review.author_id === session?.user.id
  );

  return (
    <div className="container mx-auto pb-5 pt-10 text-sm font-normal">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-x-10 gap-y-8 px-1 xs:px-3 md:flex-row md:justify-between md:px-6">
          <div className="flex gap-1 xs:gap-3">
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
                  <BookDetails variant="publisher:" text={book.publisher} />
                )}
                <BookDetails
                  variant="release date:"
                  text={book.published_date}
                />
              </div>

              {book.page_count !== 0 ||
                (book.categories.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {book.page_count !== 0 && (
                      <BookDetails variant="pages:" text={book.page_count} />
                    )}
                    {book.categories.length > 0 && (
                      <BookDetails
                        variant="genre:"
                        text={book.categories.join(", ")}
                      />
                    )}
                  </div>
                ))}

              <BookDetails
                variant="averge score:"
                text={`${arithmeticMeanOfScores(bookReviews)}/5`}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-5 px-2 md:max-w-[400px] md:justify-end">
            <div className="flex max-w-[320px] flex-wrap items-start justify-center gap-x-8 gap-y-5 sm:justify-between">
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
            <div className="flex max-w-[320px] flex-wrap items-start justify-center gap-x-8 gap-y-5 sm:justify-between">
              <ManageLikes liked={liked} quantity={book.liked_by.length} />
              <ManageReviews
                myReview={!!myReview}
                quantity={bookReviews.length}
                createdAt={myReview?.created_at}
              />
            </div>
          </div>
        </div>
        {book.description && (
          <BookDetails variant="description:" text={book.description} col />
        )}
        <div className="flex flex-col items-start divide-y divide-y-reverse divide-white-dark dark:divide-black-light">
          <CategoryLink variant="REVIEWS" href={"/#"} withoutIcon />
          {bookReviews.map((review) => (
            <Review
              key={review.id}
              profileData={review.profile}
              reactions={review.review_reaction}
              reviewCreatedAt={review.created_at}
              reviewUpdatedAt={review.updated_at}
              score={review.score}
              isLiked={book.liked_by.some(
                (profile) => profile.id === review.author_id
              )}
              text={review.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
