import type { FC } from "react";

import { db } from "~/lib/db";
import readUserSession from "~/lib/supabase/readUserSession";

import { NavbarLink } from "./NavbarLink";

export const Navbar: FC = async () => {
  const {
    data: { session },
  } = await readUserSession();

  const userData =
    session?.user &&
    (await db.profile.findUnique({
      where: { id: session.user.id },
      select: { full_name: true },
    }));

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--nav-height)] flex-none items-center justify-center rounded-t-lg bg-white text-black-dark drop-shadow-light before:absolute before:z-[-1] before:h-[68px] before:w-[68px] before:rounded-full before:bg-white dark:bg-black dark:text-white-light dark:drop-shadow-dark before:dark:bg-black md:sticky md:top-0 md:h-[58px] md:rounded-none before:md:hidden">
        <div className="flex h-full w-full max-w-[425px] items-center justify-between gap-3 px-8 xs:px-12 md:max-w-[1440px] md:justify-end md:px-6">
          <NavbarLink pageUrl={null} />
          <NavbarLink
            fullname={userData?.full_name}
            pageUrl={session ? "profile" : "login"}
          />
          <NavbarLink pageUrl="search" />
        </div>
      </nav>
    </>
  );
};
