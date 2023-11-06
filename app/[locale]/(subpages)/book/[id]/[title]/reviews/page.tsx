import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { reviewsOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
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

  const reviewsQuantity = await db.review.count({
    where: {
      book_id: id,
      text: { not: null },
      profile: {
        full_name: { not: null },
      },
    },
  });

  return (
    <div className="flex flex-col">
      <BackCategoryLink href={`../${title}`} variant="MY_REVIEW" hrefReplace />
      <FeedWithSorting
        feedVariant="reviews"
        sessionId={session?.user.id}
        userId={undefined}
        orderArray={reviewsOrderByArray}
        takeLimit={reviewsQuantity < 10 ? reviewsQuantity : 10}
        bookId={id}
      />
    </div>
  );
}
