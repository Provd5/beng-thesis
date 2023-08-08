import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { BookCover } from "~/components/Book/BookCover";
import { BookDetails } from "~/components/Book/BookDetails";
import { Review } from "~/components/Book/Review";
import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { db } from "~/lib/db";
import { arithmeticMeanOfScores } from "~/utils/arithmeticMean";

export default async function BookReviewsPage({
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

  const [book, bookReviews, myReactions] = await Promise.all([
    db.book.findFirst({
      where: { id: id },
      select: {
        authors: true,
        title: true,
        subtitle: true,
        thumbnail_url: true,
        liked_by: { select: { user_id: true } },
      },
    }),
    db.review.findMany({
      where: { book_id: id },
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
    }),
    session?.user &&
      (await db.profile.findFirst({
        where: { id: session.user.id },
        select: {
          review_reaction: { select: { review_id: true, reaction: true } },
        },
      })),
  ]);

  if (!book) notFound();

  const isBookLiked = (userId: string | undefined) => {
    return book.liked_by.some((profile) => profile.user_id === userId);
  };

  const myReaction = (reviewId: string) => {
    return myReactions?.review_reaction.find(
      (reaction) => reaction.review_id === reviewId
    )?.reaction;
  };

  return (
    <div className="container pb-5 pt-10 text-sm">
      <div className="flex flex-col items-start divide-y-2 divide-y-reverse divide-white-dark dark:divide-black-light">
        <BackCategoryLink href={`/book/${id}/${title}`} variant="REVIEWS" />
        <div className="flex w-full gap-1 px-3 py-6 xs:gap-3">
          <BookCover coverUrl={book.thumbnail_url} />

          <div className="mt-0.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold">{book.title}</h1>
              {book.subtitle && <h2>{book.subtitle}</h2>}
            </div>

            <p className="text-black-light dark:text-white-dark">
              {book.authors.join(", ")}
            </p>

            <BookDetails
              variant="averge score:"
              text={`${arithmeticMeanOfScores(bookReviews)}/5`}
            />
          </div>
        </div>
        {bookReviews.map((review) => (
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
  );
}
