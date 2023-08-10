"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { CgProfile } from "react-icons/cg";
import { FaPenToSquare } from "react-icons/fa6";

import { LogoutButton } from "../ui/LogoutButton";
import { ModalInitiator } from "./ModalInitiator";

interface AccountSettingsProps {
  userFullname: {
    full_name: string | null;
  } | null;
}

export const AccountSettings: FC<AccountSettingsProps> = ({ userFullname }) => {
  const t = useTranslations("Other");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <CgProfile className="text-lg" />
          </div>
        }
      >
        <div className="flex flex-col gap-2 whitespace-nowrap text-base">
          {userFullname && userFullname.full_name && (
            <Link
              className="flex items-center gap-1 whitespace-nowrap py-0.5"
              href="/edit"
            >
              <FaPenToSquare />
              {t("customise")}
            </Link>
          )}
          <LogoutButton />
        </div>
      </ModalInitiator>
    </>
  );
};
