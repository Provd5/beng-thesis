import { PageContainer } from "~/components/ui/PageContainer";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
