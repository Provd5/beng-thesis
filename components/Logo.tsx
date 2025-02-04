import type { FC } from "react";
import Image, { type StaticImageData } from "next/image";

import { Link } from "~/i18n/routing";
import LogoImage from "~/public/booksphere-logo.svg";
import ROUTES from "~/utils/routes";

export const APP_NAME = "Booksphere";

export const Logo: FC = ({}) => {
  return (
    <div className="absolute left-3 top-2">
      <Link
        href={ROUTES.root}
        className="flex h-8 select-none items-center gap-1"
      >
        <Image
          alt={`${APP_NAME} Logo`}
          src={LogoImage as StaticImageData}
          height={28}
          width={28}
          priority
        />
        <h1 className="text-md text-white">{APP_NAME}</h1>
      </Link>
    </div>
  );
};
