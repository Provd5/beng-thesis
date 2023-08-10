import type { FC } from "react";
import clsx from "clsx";

import { TbLoader3 } from "react-icons/tb";

interface LoaderProps {
  className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
  return <TbLoader3 className={clsx(className, "animate-spin")} />;
};
