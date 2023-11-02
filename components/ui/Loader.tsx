import type { FC } from "react";
import clsx from "clsx";

import { TbLoader3 } from "react-icons/tb";

interface LoaderProps {
  className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
  return <TbLoader3 className={clsx(className, "animate-spin")} />;
};

interface TextLoaderProps {
  className?: string;
  height: "h1" | "h2" | "h3";
}

export const TextLoader: FC<TextLoaderProps> = ({ className, height }) => {
  const size = {
    h1: "h-5",
    h2: "h-3.5",
    h3: "h-3",
  };

  return <div className={clsx("rounded bg-gray", size[height], className)} />;
};
