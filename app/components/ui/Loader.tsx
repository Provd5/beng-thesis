import type { FC } from "react";
import { TbLoader3 } from "react-icons/tb";

interface LoaderProps {
  className?: string;
}

export const Loader: FC<LoaderProps> = ({ className }) => {
  return (
    <TbLoader3 className={(className ?? "") + " h-full w-full animate-spin"} />
  );
};
