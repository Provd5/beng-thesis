import { PageContainer } from "~/components/ui/PageContainer";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden">
      <PageContainer>{children}</PageContainer>
    </main>
  );
}
