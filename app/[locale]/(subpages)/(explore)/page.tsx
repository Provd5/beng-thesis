import { type Metadata } from "next";

import { booksOrderByArray } from "~/types/feed/OrderVariants";

import { FeedWithSorting } from "~/components/Feed/FeedWithSorting";

export function generateMetadata(): Metadata {
  return {
    title: "Explore",
  };
}

export default function ExplorePage() {
  return (
    <div className="container pb-6">
      <FeedWithSorting
        feedVariant="books"
        orderArray={booksOrderByArray}
        takeLimit={20}
        profileName={undefined}
        variant={undefined}
      />
    </div>
  );
}
