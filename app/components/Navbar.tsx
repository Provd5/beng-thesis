import type { FC } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "./ui/Button";

export const Navbar: FC = async ({}) => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <div className="bg-neutral-600">
        <nav className="flex h-10 w-full items-center justify-center ">
          <Button variant="link">
            <Link href={`/`}>home</Link>
          </Button>
          {!session ? (
            <Button variant="link">
              <Link href={`/login`}>login</Link>
            </Button>
          ) : (
            <Button variant="link">
              <Link href={`/account`}>account</Link>
            </Button>
          )}
        </nav>
      </div>
    </>
  );
};
