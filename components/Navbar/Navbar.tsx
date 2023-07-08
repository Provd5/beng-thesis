import type { FC } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { getTranslator, type Locale } from "~/dictionaries";

import { NavbarLink } from "./NavbarLink";
import { ExploreIcon, ProfileIcon, SearchIcon } from "./NavIcons";

interface NavbarProps {
  params: { lang: Locale };
}

export const Navbar: FC<NavbarProps> = async ({ params }) => {
  const t = await getTranslator(params.lang);

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--nav-height)] shrink-0 items-center justify-center gap-12 rounded-t-lg bg-white text-black-dark drop-shadow-light before:absolute before:z-[-1] before:h-16 before:w-16 before:rounded-full before:bg-white dark:bg-black dark:text-white-light dark:drop-shadow-dark before:dark:bg-black md:sticky md:top-0 md:h-[58px] md:rounded-none before:md:hidden">
        <NavbarLink href="/explore" text={t.Explore.categoryTitle}>
          <ExploreIcon />
        </NavbarLink>
        <NavbarLink
          big
          href={session ? "/" : "/login"}
          text={session ? t.Profile.categoryTitle : t.Login.categoryTitle}
        >
          <ProfileIcon />
        </NavbarLink>
        <NavbarLink href="/search" text={t.Search.categoryTitle}>
          <SearchIcon />
        </NavbarLink>
      </nav>
    </>
  );
};
