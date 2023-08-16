import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { MyReview } from "~/components/Book/MyReview";
import { Review } from "~/components/Book/Review";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { db } from "~/lib/db";

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

  const myReview =
    session?.user &&
    (await db.review.findFirst({
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
                liked_book: { where: { book_id: id } },
              },
            },
          },
        },
      },
    }));

  const doILikeThisBook = !!myReview?.profile._count.liked_book;
  const myReaction = myReview?.review_reaction?.[0]?.reaction;

  return (
    <div className="flex flex-col items-start divide-y-2 divide-y-reverse divide-white-dark dark:divide-black-light">
      <CategoryLink
        variant="REVIEWS"
        href={`/book/${id}/${title}/reviews`}
        withoutIcon
      />
      <MyReview
        isReviewExists={!!myReview}
        bookId={id}
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
  );
}
