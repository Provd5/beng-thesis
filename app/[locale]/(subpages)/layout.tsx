import { cookies } from "next/headers";

import { Settings } from "~/components/Modals/Settings";
import { type localeTypes } from "~/i18n";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/require-await
  const setLangCookie = async (data: localeTypes) => {
    "use server";
    cookies().set("lang", data);
  };

  return (
    <main className="grow-1 relative flex h-full flex-col overflow-x-hidden">
      <div className="flex h-12 flex-none items-center self-end px-3 text-white">
        <div className="h-fit">
          <Settings setLangCookie={setLangCookie} />
        </div>
      </div>
      <div className="nav-padding relative flex flex-auto flex-col rounded-t-3xl bg-white/90 dark:bg-black/90 md:rounded-none">
        {children}
      </div>
    </main>
  );
}
