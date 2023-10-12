"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { FaUserCircle } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";

import { AvatarImage } from "../Profile/AvatarImage";
import { LogoutButton } from "../ui/LogoutButton";
import { ModalInitiator } from "./ModalInitiator";

interface AccountSettingsProps {
  userFullname: string | null | undefined;
  userAvatarUrl: string | null | undefined;
}

export const AccountSettings: FC<AccountSettingsProps> = ({
  userFullname,
  userAvatarUrl,
}) => {
  const t = useTranslations("Other");

  return (
    <>
      <ModalInitiator
        initiatorStyle={
          <div className="transition-transform hover:scale-110">
            <FaUserCircle className="h-6 w-6" />
          </div>
        }
      >
        <div className="flex flex-col gap-2 whitespace-nowrap text-md">
          {userFullname && (
            <>
              <Link
                className="mx-[-14px] flex items-center gap-1.5 py-1 text-sm"
                href={`/profile/${userFullname}`}
              >
                <AvatarImage avatarSrc={userAvatarUrl} size="xs" />
                <span className="max-w-[150px] truncate">{userFullname}</span>
              </Link>
              <hr className="mx-[-10px] h-px border-0 bg-black-light dark:bg-white-dark" />
            </>
          )}
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
