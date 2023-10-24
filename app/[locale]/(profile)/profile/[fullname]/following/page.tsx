import FollowPage from "~/components/Profile/FollowPage";

export default function FollowingPage({
  params: { fullname },
}: {
  params: { fullname: string };
}) {
  return (
    <>
      <FollowPage fullname={fullname} variant="following" />
    </>
  );
}
