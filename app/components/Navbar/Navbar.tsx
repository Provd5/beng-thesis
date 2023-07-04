import type { FC } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { NavbarLink } from "./NavbarLink";
import { ExploreIcon, ProfileIcon, SearchIcon } from "./NavIcons";

export const Navbar: FC = async ({}) => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <div className="hidden h-[var(--nav-height)] w-full shrink-0 md:block" />
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--nav-height)] items-center justify-center gap-12 rounded-t-2xl bg-white text-black-dark drop-shadow-light before:absolute before:z-[-1] before:h-20 before:w-20 before:rounded-full before:bg-white dark:bg-black dark:text-white-light dark:drop-shadow-dark before:dark:bg-black md:top-0 md:rounded-none">
        <NavbarLink href="/explore" text="Explore">
          <ExploreIcon />
        </NavbarLink>
        <NavbarLink
          big
          href={session ? "/profile" : "/login"}
          text={session ? "Profile" : "Log in"}
        >
          <ProfileIcon />
        </NavbarLink>
        <NavbarLink href="/search" text="Search">
          <SearchIcon />
        </NavbarLink>
      </nav>
    </>
  );
};
