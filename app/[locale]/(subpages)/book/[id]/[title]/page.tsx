import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";

import { AllReviewsButton } from "~/components/Book/AllReviewsButton";
import { MyReview } from "~/components/Book/MyReview";
import { CategoryLink } from "~/components/ui/CategoryLink";
import { type localeTypes } from "~/i18n";

export default async function BookPage({
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

  return (
    <>
      <div className="flex flex-col">
        <CategoryLink
          href={{ pathname: `${title}/reviews`, query: searchParams }}
          variant="REVIEWS"
          hrefReplace
        />
        <MyReview bookId={id} sessionId={session?.user.id} />
      </div>
      {session?.user.id && (
        <AllReviewsButton
          href={{ pathname: `${title}/reviews`, query: searchParams }}
        />
      )}
    </>
  );
}
