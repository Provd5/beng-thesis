import type { FC } from "react";

import { Loader } from "./Loader";

export const LoadingPage: FC = () => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-gradient-light text-white-light dark:bg-gradient-dark dark:text-white">
      <div className="max-w-24 h-1/3 max-h-24 w-1/3">
        <Loader className="h-full w-full" />
      </div>
    </div>
  );
};
