import { Settings } from "~/components/Settings";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="nav-padding relative flex h-full flex-col text-xl text-white-light">
      {children}
      <Settings />
    </main>
  );
}
