"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { MdNavigateNext } from "react-icons/md";

interface FollowLinksProps {
  followers: number;
  following: number;
  reviews: number;
}

export const FollowLinks: FC<FollowLinksProps> = ({
  followers,
  following,
  reviews,
}) => {
  const t = useTranslations("Profile.Page");

  return (
    <>
      <div className="flex flex-col gap-1 text-sm">
        <Link href="/#">
          <InnerLink text={t("followers:")} quantity={followers} />
        </Link>
        <Link href="/#">
          <InnerLink text={t("following:")} quantity={following} />
        </Link>
        <Link href="/#">
          <InnerLink text={t("reviews:")} quantity={reviews} />
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
        <p>{text}</p>
        <p className="ml-1 font-normal">{quantity.toString()}</p>
        <MdNavigateNext className="text-lg" />
      </div>
    </>
  );
};
