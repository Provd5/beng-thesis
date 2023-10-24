import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { Review } from "~/components/Book/Review";
import { ReviewsNotFound } from "~/components/Book/ReviewsNotFound";
import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { db } from "~/lib/db";

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

  const [bookReviews, myReactions] = await Promise.all([
    db.review.findMany({
      where: {
        book_id: id,
        text: { not: null },
        profile: {
          full_name: { not: null },
        },
      },
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
                liked_book: { where: { book_id: id } },
              },
            },
          },
        },
      },
    }),
    session?.user &&
      (await db.profile.findUnique({
        where: { id: session.user.id },
        select: {
          review_reaction: { select: { review_id: true, reaction: true } },
        },
      })),
  ]);

  const myReaction = (reviewId: string) => {
    return myReactions?.review_reaction.find(
      (reaction) => reaction.review_id === reviewId
    )?.reaction;
  };

  return (
    <div className="flex flex-col items-start divide-y-2 divide-y-reverse divide-white-dark dark:divide-black-light">
      <BackCategoryLink href={`../${title}`} variant="MY_REVIEW" hrefReplace />
      {bookReviews.length > 0 ? (
        bookReviews.map((review) => (
          <Review
            key={review.id}
            id={review.id}
            profileData={review.profile}
            reviewCreatedAt={review.created_at}
            reviewUpdatedAt={review.updated_at}
            isLiked={!!review.profile._count.liked_book}
            score={review.score}
            text={review.text}
            reactions={review.review_reaction}
            userReaction={myReaction(review.id)}
          />
        ))
      ) : (
        <ReviewsNotFound backToHref={`/book/${id}/${title}`} />
      )}
    </div>
  );
}
