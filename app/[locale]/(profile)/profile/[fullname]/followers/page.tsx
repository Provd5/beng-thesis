import { FollowPage } from "~/components/Profile/FollowPage";

export default function FollowersPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  return <FollowPage fullname={fullname} variant="followers" />;
}
