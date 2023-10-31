import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { BooksFeed } from "~/components/Feed/BooksFeed";

export default async function ExplorePage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container py-6">
      <BooksFeed userId={session?.user.id} />
    </div>
  );
}
