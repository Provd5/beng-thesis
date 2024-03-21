import type { FC } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { BsCheck } from "react-icons/bs";

import { type OwnedBookTypes } from "~/types/data/bookshelf";

import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";

interface OwnedAsModalProps {
  ownedAs: OwnedBookTypes;
  state: string | null;
  handleAddFunc: () => void;
}

export const OwnedAsModal: FC<OwnedAsModalProps> = ({
  ownedAs,
  state,
  handleAddFunc,
}) => {
  const t = useTranslations("Book.ManageOwnedAs");

  return (
    <button
      onClick={handleAddFunc}
      className="flex flex-auto justify-between gap-2 py-1"
    >
      <div className="flex items-center gap-1.5">
        <OwnedBookIcon ownedAs={ownedAs} />
        <div className="flex h-8 flex-col items-start justify-center">
          <h1
            className={clsx(
              "text-base",
              state && "text-secondary dark:text-secondary-light"
            )}
          >
            {t(ownedAs)}
          </h1>
          <p className="text-xs text-black-light dark:text-white-dark">
            {state}
          </p>
        </div>
      </div>
      <div className="h-6 w-6 self-center">
        {state && (
          <BsCheck className="h-full w-full fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]" />
        )}
      </div>
    </button>
  );
};
