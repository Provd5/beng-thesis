import type { FC } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { db } from "~/lib/db";

import { NavbarLink } from "./NavbarLink";

export const Navbar: FC = async () => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userData = await db.profile.findFirst({
    where: { id: session?.user.id },
    select: { full_name: true },
  });

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--nav-height)] shrink-0 items-center justify-center gap-12 rounded-t-lg bg-white text-black-dark drop-shadow-light before:absolute before:z-[-1] before:h-[68px] before:w-[68px] before:rounded-full before:bg-white dark:bg-black dark:text-white-light dark:drop-shadow-dark before:dark:bg-black md:sticky md:top-0 md:h-[58px] md:rounded-none before:md:hidden">
        <NavbarLink href="explore" />
        <NavbarLink
          fullname={userData?.full_name}
          href={session ? "profile" : "login"}
        />
        <NavbarLink href="search" />
      </nav>
    </>
  );
};
