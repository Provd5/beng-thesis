import { type FC, Suspense } from "react";

import { Settings } from "../Modals/Settings";
import { Loader } from "../ui/Loaders/Loader";
import { AccountBadge } from "./AccountBadge";

export const Badges: FC = async ({}) => {
  return (
    <div className="flex h-fit gap-3">
      <Suspense key={"Badges"} fallback={<Loader />}>
        <AccountBadge />
      </Suspense>
      <Settings />
    </div>
  );
};
