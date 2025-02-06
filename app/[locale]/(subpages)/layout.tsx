import { Badges } from "~/components/Links/Badges";
import { Logo } from "~/components/Logo";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden overflow-y-scroll scroll-smooth">
      <Logo />
      <div className="flex h-12 flex-none items-center self-end px-3 text-white">
        <Badges />
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-colors-background md:rounded-none">
        {children}
      </div>
    </main>
  );
}
