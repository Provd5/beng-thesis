import { Suspense } from "react";

import { Badges } from "~/components/Links/Badges";
import { Logo } from "~/components/Logo";
import { Loader } from "~/components/ui/Loaders/Loader";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex h-full grow-1 flex-col overflow-x-hidden overflow-y-scroll scroll-smooth">
      <Logo />
      <div className="flex h-12 flex-none items-center self-end px-3 text-white">
        <Suspense key={"Badges"} fallback={<Loader />}>
          <Badges />
        </Suspense>
      </div>
      <div className="nav-padding bg-colors-background relative flex flex-auto flex-col rounded-t-3xl md:rounded-none">
        {children}
      </div>
    </main>
  );
}
