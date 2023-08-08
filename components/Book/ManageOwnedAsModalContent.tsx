import type { FC } from "react";
import clsx from "clsx";

import { BsCheck } from "react-icons/bs";

import { getOwnedAsIcon } from "~/components/ui/getOwnedAsIcon";
import { type ownedAsType } from "~/lib/validations/book/ownedAs";

interface ManageOwnedAsModalContentProps {
  text: string;
  ownedAs: ownedAsType;
  addedState: string | null;
  onClickFunc: () => void;
  isLoading: boolean;
}

export const ManageOwnedAsModalContent: FC<ManageOwnedAsModalContentProps> = ({
  text,
  ownedAs,
  addedState,
  onClickFunc,
  isLoading,
}) => {
  return (
    <button
      disabled={isLoading}
      onClick={onClickFunc}
      className="flex flex-auto justify-between gap-2 py-1"
    >
      <div className="flex items-center gap-1.5">
        {getOwnedAsIcon(ownedAs)}
        <div className="flex h-8 flex-col items-start justify-center">
          <h1
            className={clsx(
              "text-base",
              addedState && "text-secondary dark:text-secondary-light"
            )}
          >
            {text}
          </h1>
          <p className="text-xs text-black-light dark:text-white-dark">
            {addedState}
          </p>
        </div>
      </div>
      <div className="h-6 w-6 self-center">
        {addedState && (
          <BsCheck className="h-full w-full fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]" />
        )}
      </div>
    </button>
  );
};
