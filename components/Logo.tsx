import type { FC } from "react";
import Image from "next/image";

import LogoImage from "~/assets/booksphere-logo.svg";

export const Logo: FC = ({}) => {
  return (
    <>
      <div className="absolute left-3 top-2">
        <div className="pointer-events-none flex h-8 select-none items-center gap-1">
          <Image
            alt="Booksphere Logo"
            src={LogoImage as string}
            height={28}
            width={28}
            priority
          />
          <h1 className="text-md text-white-light">Booksphere</h1>
        </div>
      </div>
    </>
  );
};
