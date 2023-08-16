"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { FaUserCircle } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

import { LogoutButton } from "../ui/LogoutButton";
import { ModalInitiator } from "./ModalInitiator";

export const AccountSettings: FC = () => {
  const t = useTranslations("Other");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="hover:scale-105">
            <FaUserCircle className="h-6 w-6" />
          </div>
        }
      >
        <div className="flex flex-col gap-2 whitespace-nowrap text-md">
          <Link
            className="flex items-center gap-1.5 whitespace-nowrap py-1"
            href="/edit-profile"
          >
            <FaPenToSquare />
            {t("edit profile")}
          </Link>
          <LogoutButton />
        </div>
      </ModalInitiator>
    </>
  );
};
