"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

import { FaUserCircle } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

import { Link } from "~/i18n/routing";
import ROUTES from "~/utils/routes";

import { LogoutButton } from "../Auth/LogoutButton";
import { ModalInitiator } from "./ModalInitiator";

interface AccountSettingsProps {
  children: React.ReactNode;
}

export const AccountSettings: FC<AccountSettingsProps> = ({ children }) => {
  const t = useTranslations("Other");

  return (
    <ModalInitiator
      initiatorStyle={
        <div className="transition-transform hover:scale-110">
          <FaUserCircle className="size-6" />
        </div>
      }
    >
      <div className="text-md flex min-w-[180px] flex-col gap-2 whitespace-nowrap">
        {children && (
          <>
            <div>
              <h1 className="my-1 text-center font-semibold text-colors-primary">
                {t("my account")}
              </h1>
              {children}
            </div>
            <hr className="mx-[-10px] h-px border-0 bg-colors-gray/30" />
          </>
        )}
        <Link
          className="flex items-center gap-1.5 whitespace-nowrap py-1 transition-transform hover:translate-x-1"
          href={ROUTES.profile.edit_profile}
        >
          <FaPenToSquare />
          {t("edit profile")}
        </Link>
        <LogoutButton />
      </div>
    </ModalInitiator>
  );
};
