import type { FC } from "react";
import Image from "next/image";

import LogoBook from "~/assets/booksphere-book.svg";
import LogoSphere from "~/assets/booksphere-sphere.svg";

export const LoadingPage: FC = () => {
  return (
    <div className="bodyGradient absolute inset-0 z-40 flex items-center justify-center text-white-light">
      <div className="flex flex-col items-center">
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
