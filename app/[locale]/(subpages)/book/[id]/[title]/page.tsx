import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";

import { AllReviewsButton } from "~/components/Book/AllReviewsButton";
import { MyReview } from "~/components/Book/MyReview";
import { CategoryLink } from "~/components/ui/CategoryLink";

export default async function BookPage({
  params: { id, title },
  searchParams,
}: {
  params: { id: string; title: string };
  searchParams?: string;
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

  return (
    <>
      <div className="flex flex-col">
        <CategoryLink
          href={{ pathname: `${title}/reviews`, query: searchParams }}
          variant="REVIEWS"
          hrefReplace
          withoutIcon
        />
        <MyReview bookId={id} sessionId={session?.user.id} />
      </div>
      <AllReviewsButton href={`${title}/reviews`} />
    </>
  );
}
