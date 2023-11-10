import { type Metadata } from "next";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { profilesOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";

export function generateMetadata(): Metadata {
  return {
    title: "Community",
  };
}

export default async function CommunityPage() {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="container pb-6">
      <FeedWithSorting
        feedVariant="profiles"
        orderArray={profilesOrderByArray}
        takeLimit={30}
        sessionId={session?.user.id}
        userId={undefined}
        variant={undefined}
      />
    </div>
  );
}
