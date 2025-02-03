import { Suspense } from "react";

import { Badges } from "~/components/Links/Badges";
import { Logo } from "~/components/Logo";
import { Loader } from "~/components/ui/Loaders/Loader";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex h-full grow-1 flex-col overflow-x-hidden overflow-y-scroll scroll-smooth">
      <Logo />
      <div className="flex h-[68px] flex-none self-end p-3 text-white">
        <Suspense key={"Badges"} fallback={<Loader />}>
          <Badges />
        </Suspense>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 md:rounded-none dark:bg-black/90">
        <div className="container pb-12">{children}</div>
      </div>
    </main>
  );
}
