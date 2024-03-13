import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import LogoImage from "~/public/booksphere-logo.svg";

export const Logo: FC = ({}) => {
  return (
    <>
      <div className="absolute left-3 top-2">
        <Link href={"/"} className="flex h-8 select-none items-center gap-1">
          <Image
            alt="Booksphere Logo"
            src={LogoImage as string}
            height={28}
            width={28}
            priority
          />
          <h1 className="text-md text-white-light">Booksphere</h1>
        </Link>
      </div>
    </>
  );
};
