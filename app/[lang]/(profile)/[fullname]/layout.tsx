import { ProfilePageContainer } from "~/components/ui/PageContainer";

// eslint-disable-next-line @typescript-eslint/require-await
export default async function FullnameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfilePageContainer>{children}</ProfilePageContainer>;
}
