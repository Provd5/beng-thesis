import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { booksOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";

export default async function ExplorePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container pb-6">
      <FeedWithSorting
        takeLimit={20}
        userId={session?.user.id}
        feedVariant="books"
        orderArray={booksOrderByArray}
      />
    </div>
  );
}
