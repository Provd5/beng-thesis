"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { MdNavigateNext } from "react-icons/md";

import { FollowProfileButton } from "../ui/FollowProfileButton";

interface FollowLinksProps {
  id: string;
  fullname: string;
  isMyProfile: boolean;
  isFollowed: boolean;
  followers: number;
  following: number;
}

export const FollowLinks: FC<FollowLinksProps> = ({
  id,
  fullname,
  isMyProfile,
  isFollowed,
  followers,
  following,
}) => {
  const t = useTranslations("Profile.Page");
  const pathname = usePathname();

  const [isFollowedState, setIsFollowedState] = useState(isFollowed);

  return (
    <>
      <div className="flex w-fit flex-col gap-2 text-sm">
        {pathname.endsWith(`${fullname}/followers`) ? (
          <InnerLink text={t("followers:")} quantity={followers} isActive />
        ) : (
          <Link href={`/profile/${fullname}/followers`}>
            <InnerLink text={t("followers:")} quantity={followers} />
          </Link>
        )}
        {pathname.endsWith(`${fullname}/following`) ? (
          <InnerLink text={t("following:")} quantity={following} isActive />
        ) : (
          <Link href={`/profile/${fullname}/following`}>
            <InnerLink text={t("following:")} quantity={following} />
          </Link>
        )}
        {!isMyProfile && (
          <FollowProfileButton
            id={id}
            isFollowedState={isFollowedState}
            setIsFollowedState={setIsFollowedState}
            className="ml-[-15px] w-40"
          />
        )}
      </div>
    </>
  );
};

interface InnerLinkProps {
  text: string;
  quantity: number;
  isActive?: boolean;
}

const InnerLink: FC<InnerLinkProps> = ({
  text,
  quantity,
  isActive = false,
}) => {
  return (
    <>
      <div
        className={clsx(
          "flex w-fit items-center",
          isActive && "text-secondary dark:text-secondary-light"
        )}
      >
        <h1 className="py-0.5 font-semibold">{text}</h1>
        <p className="ml-1">{quantity.toString()}</p>
        {!isActive && <MdNavigateNext className="text-lg" />}
      </div>
    </>
  );
};
