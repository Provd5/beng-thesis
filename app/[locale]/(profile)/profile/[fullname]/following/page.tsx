import { type Metadata } from "next";

import { FollowPage } from "~/components/Profile/FollowPage";

export function generateMetadata(): Metadata {
  return {
    title: "following",
  };
}

export default function FollowingPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  return <FollowPage fullname={fullname} variant="following" />;
}
