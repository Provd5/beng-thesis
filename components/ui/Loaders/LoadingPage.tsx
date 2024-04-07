import type { FC } from "react";
import Image from "next/image";

import LogoBook from "~/public/booksphere-book.svg";
import LogoSphere from "~/public/booksphere-sphere.svg";

export const LoadingPage: FC = () => {
  return (
    <div className="bg-gradient pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <Image
          src={LogoSphere as string}
          alt="Loading Shpere"
          className="animate-bounce"
          width={130}
          priority
        />
        <Image src={LogoBook as string} alt="Logo Book" width={190} priority />
      </div>
    </div>
  );
};
