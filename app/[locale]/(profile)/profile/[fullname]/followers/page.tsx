import { type Metadata } from "next";

import { FollowPage } from "~/components/Profile/FollowPage";

export function generateMetadata(): Metadata {
  return {
    title: "followers",
  };
}

export default function FollowersPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  return <FollowPage fullname={fullname} variant="followers" />;
}
