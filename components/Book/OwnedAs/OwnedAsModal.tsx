"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { BsCheck } from "react-icons/bs";

import { type OwnedBookTypes } from "~/types/consts";

import { OwnedBookIcon } from "~/components/ui/Icons/OwnedBookIcon";
import { cn } from "~/utils/cn";

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
      className="flex flex-auto justify-between gap-2 py-1 transition-transform hover:scale-95"
    >
      <div className="flex items-center gap-1.5">
        <OwnedBookIcon ownedAs={ownedAs} />
        <div className="flex h-8 flex-col items-start justify-center">
          <h1 className={cn("text-base", state && "text-colors-primary")}>
            {t(ownedAs)}
          </h1>
          <p className="text-xs text-colors-text">{state}</p>
        </div>
      </div>
      <div className="size-6 self-center">
        {state && <BsCheck className="size-full fill-colors-primary" />}
      </div>
    </button>
  );
};
