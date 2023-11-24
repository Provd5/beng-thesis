import { type Metadata } from "next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { booksOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";

export function generateMetadata(): Metadata {
  return {
    title: "Explore",
  };
}

export default async function ExplorePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container pb-12">
      <FeedWithSorting
        feedVariant="books"
        orderArray={booksOrderByArray}
        takeLimit={20}
        sessionId={session?.user.id}
        profileName={undefined}
        variant={undefined}
      />
    </div>
  );
}
