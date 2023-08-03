import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

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
      liked_by: { select: { user_id: true } },
      bookshelf: session ? { where: { user_id: session.user.id } } : false,
      book_owned_as: session ? { where: { user_id: session.user.id } } : false,
    },
  });

  if (!book) notFound();
  const bookshelfData = book.bookshelf ? book.bookshelf[0] : null;
  const ownedAsData = book.book_owned_as ? book.book_owned_as[0] : null;
  const isBookLiked = (userId: string | undefined) => {
    return book.liked_by.some((profile) => profile.user_id === userId);
  };

  const bookReviews = await db.review.findMany({
    where: { book_id: book.id },
    include: {
      review_reaction: { select: { reaction: true } },
      profile: {
        select: {
          id: true,
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

  const myProfile =
    session?.user &&
    (await db.profile.findFirst({
      where: { id: session.user.id },
      select: {
        avatar_url: true,
        full_name: true,
        review_reaction: { select: { review_id: true, reaction: true } },
      },
    }));

  const myReaction = (reviewId: string) => {
    return myProfile?.review_reaction.find(
      (reaction) => reaction.review_id === reviewId
    )?.reaction;
  };

  const myReview =
    session?.user &&
    bookReviews.find((review) => review.author_id === session.user.id);

  const otherReviews = bookReviews.filter((review) => review !== myReview);

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
              <ManageLikes
                bookId={book.id}
                liked={isBookLiked(session?.user.id)}
                quantity={book.liked_by.length}
              />
              <ManageReviews
                myReview={!!myReview}
                quantity={bookReviews.length}
                createdAt={myReview?.created_at}
              />
            </div>
          </div>
        </div>
        {book.description && (
          <BookDetails variant="description:" text={book.description} />
        )}
        <div className="flex flex-col items-start divide-y-2 divide-y-reverse divide-white-dark dark:divide-black-light">
          <CategoryLink variant="REVIEWS" href={"/#"} withoutIcon />
          <MyReview
            isReviewExists={!!myReview?.id}
            bookId={book.id}
            myProfileData={myProfile}
            score={myReview?.score}
            text={myReview?.text}
          >
            {myReview && (
              <Review
              id={myReview.id}
                profileData={myReview.profile}
                reviewCreatedAt={myReview.created_at}
                reviewUpdatedAt={myReview.updated_at}
                isLiked={isBookLiked(myReview.author_id)}
                score={myReview.score}
                text={myReview.text}
                reactions={myReview.review_reaction}
                userReaction={myReaction(myReview.id)}
                isMyReview
              />
            )}
          </MyReview>
          {otherReviews.map((review) => (
            <Review
              key={review.id}
              id={review.id}
              profileData={review.profile}
              reviewCreatedAt={review.created_at}
              reviewUpdatedAt={review.updated_at}
              isLiked={isBookLiked(review.author_id)}
              score={review.score}
              text={review.text}
              reactions={review.review_reaction}
              userReaction={myReaction(review.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
