import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { ManageBookshelf } from "~/components/Book/ManageBookshelf";
import { ManageLikes } from "~/components/Book/ManageLikes";
import { ManageOwnedAs } from "~/components/Book/ManageOwnedAs";
import { ManageReviews } from "~/components/Book/ManageReviews";
import { MyReview } from "~/components/Book/MyReview";
import { Review } from "~/components/Book/Review";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { db } from "~/lib/db";
import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

export default async function BookPage({
  params: { id, title },
}: {
  params: { id: string; title: string };
}) {
  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const [book, bookReviews, myReview] = await Promise.all([
    db.book.findFirst({
      where: { id: id },
      include: {
        liked_by: true,
        bookshelf: session ? { where: { user_id: session.user.id } } : false,
        book_owned_as: session
          ? { where: { user_id: session.user.id } }
          : false,
      },
    }),
    db.review.findMany({
      where: { book_id: id },
      select: { score: true },
    }),
    session?.user &&
      db.review.findFirst({
        where: { book_id: id, author_id: session.user.id },
        include: {
          review_reaction: {
            where: { user_id: session.user.id },
            select: { reaction: true },
          },
          profile: {
            select: {
              id: true,
              avatar_url: true,
              full_name: true,
              created_at: true,
              _count: {
                select: {
                  bookshelf: {
                    where: { bookshelf: { equals: "ALREADY_READ" } },
                  },
                  review: true,
                },
              },
            },
          },
        },
      }),
  ]);

  if (!book) notFound();

  const myBookshelfData = book.bookshelf?.[0];
  const myOwnedAsData = book.book_owned_as?.[0];
  const doILikeThisBook = book.liked_by.some(
    (profile) => session && profile.user_id === session.user.id
  );
  const myReaction = myReview?.review_reaction?.[0]?.reaction;

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
          <div className="flex flex-wrap content-start justify-center gap-8 px-2 md:max-w-[400px] md:justify-end">
            <div className="flex h-fit flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:justify-between">
              <div className="w-36">
                <ManageBookshelf
                  bookId={book.id}
                  bookshelf={myBookshelfData?.bookshelf}
                  updatedAt={myBookshelfData?.updated_at}
                />
              </div>
              <div className="w-36">
                <ManageOwnedAs
                  bookId={book.id}
                  addedEbookAt={myOwnedAsData?.added_ebook_at}
                  addedAudiobookAt={myOwnedAsData?.added_audiobook_at}
                  addedBookAt={myOwnedAsData?.added_book_at}
                />
              </div>
            </div>
            <div className="flex h-fit flex-wrap items-start justify-center gap-x-4 gap-y-5 sm:justify-between">
              <div className="w-36">
                <ManageLikes
                  bookId={book.id}
                  liked={doILikeThisBook}
                  quantity={book.liked_by.length}
                />
              </div>
              <div className="w-36">
                <ManageReviews
                  isReviewExists={!!myReview}
                  quantity={bookReviews.length}
                  createdAt={myReview?.created_at}
                />
              </div>
            </div>
          </div>
        </div>
        {book.description && (
          <BookDetails variant="description:" text={book.description} />
        )}
        <div className="flex flex-col items-start divide-y-2 divide-y-reverse divide-white-dark dark:divide-black-light">
          <CategoryLink
            variant="REVIEWS"
            href={`/book/${id}/${title}/reviews`}
            withoutIcon
          />
          <MyReview
            isReviewExists={!!myReview}
            bookId={book.id}
            avatarUrl={myReview?.profile.avatar_url}
            fullName={myReview?.profile.full_name}
            score={myReview?.score}
            text={myReview?.text}
          >
            {myReview && (
              <Review
                id={myReview.id}
                profileData={myReview.profile}
                reviewCreatedAt={myReview.created_at}
                reviewUpdatedAt={myReview.updated_at}
                isLiked={doILikeThisBook}
                score={myReview.score}
                text={myReview.text}
                reactions={myReview.review_reaction}
                userReaction={myReaction}
                isMyReview
              />
            )}
          </MyReview>
        </div>
      </div>
    </div>
  );
}
