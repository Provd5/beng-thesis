import type { FC } from "react";

import { SubpageNavbarButton } from "./SubpageNavbarButton";

export const SubpageNavbar: FC = ({}) => {
  return (
    <div className="flex h-14 w-full justify-center rounded-t-3xl border-b border-white-light bg-white dark:border-black-dark dark:bg-black md:rounded-none">
      <div className="flex w-full max-w-[400px] justify-center">
        <SubpageNavbarButton pageUrl="explore" />
      </div>
      <div className="flex w-full max-w-[400px] justify-center">
        <SubpageNavbarButton pageUrl="community" />
      </div>
    </div>
  );
};
