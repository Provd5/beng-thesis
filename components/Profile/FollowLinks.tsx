"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

interface FollowLinksProps {
  followers: number;
  following: number;
}

export const FollowLinks: FC<FollowLinksProps> = ({ followers, following }) => {
  const t = useTranslations("Profile.Page");

  return (
    <>
      <div className="flex w-fit flex-col gap-1 text-sm">
        <Link href="/#">
          <InnerLink text={t("followers:")} quantity={followers} />
        </Link>
        <Link href="/#">
          <InnerLink text={t("following:")} quantity={following} />
        </Link>
      </div>
    </>
  );
};

interface InnerLinkProps {
  text: string;
  quantity: number;
}

const InnerLink: FC<InnerLinkProps> = ({ text, quantity }) => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-semibold">{text}</h1>
        <p className="ml-1">{quantity.toString()}</p>
        <MdNavigateNext className="text-lg" />
      </div>
    </>
  );
};
