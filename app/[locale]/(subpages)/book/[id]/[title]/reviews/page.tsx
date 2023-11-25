import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

import { reviewsOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";
import { BackCategoryLink } from "~/components/ui/BackCategoryLink";
import { type localeTypes } from "~/i18n";
import { db } from "~/lib/db";

export default async function BookReviewsPage({
  params: { id, title, locale },
  searchParams,
}: {
  params: { id: string; title: string; locale: localeTypes };
  searchParams?: string;
}) {
  unstable_setRequestLocale(locale);

  try {
    z.string().uuid().parse(id);
  } catch (error) {
    notFound();
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

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
      <BackCategoryLink
        href={{ pathname: `../${title}`, query: searchParams }}
        variant="MY_REVIEW"
        hrefReplace
      />
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
