import { ProfilePageContainer } from "~/components/ui/PageContainer";

export default function ProfileSubapagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfilePageContainer>
      <div className="container pb-6">{children}</div>
    </ProfilePageContainer>
  );
}
