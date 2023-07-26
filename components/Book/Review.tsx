"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  BsBookmarkHeartFill,
  BsBookmarkStarFill,
  BsFillBookmarkCheckFill,
} from "react-icons/bs";

import { dateFormater } from "~/utils/dateFormater";

import { AvatarImage } from "../Profile/AvatarImage";

interface ReviewProps {
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  reviewCreatedAt: Date;
  reviewUpdatedAt: Date | null;
  bookshelfQuantity: number;
  reviewQuantity: number;
  score: number;
  isLiked: boolean;
  text: string | null;
}

export const Review: FC<ReviewProps> = ({
  fullName,
  avatarUrl,
  createdAt,
  reviewCreatedAt,
  reviewUpdatedAt,
  bookshelfQuantity,
  reviewQuantity,
  score,
  isLiked,
  text,
}) => {
  const t = useTranslations("Book.Review");

  return (
    <div className="flex w-full gap-1 py-1.5">
      <Link
        href={fullName ? `/profile/${fullName}` : "#"}
        className="flex w-24 shrink-0 flex-col items-center gap-1 font-medium"
      >
        <AvatarImage avatarSrc={avatarUrl} />
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="line-clamp-3 break-all font-semibold">{fullName}</h1>
          <h2 className="flex flex-wrap justify-center text-xs text-black-light dark:text-white-dark">
            {t("joined:")} <span>{dateFormater(createdAt)}</span>
          </h2>
          <div className="my-1 flex gap-2 text-base">
            <div className="flex items-center gap-0.5">
              <BsFillBookmarkCheckFill className="text-green/70" />
              <p>{bookshelfQuantity}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <BsBookmarkStarFill className="text-yellow/70" />
              <p>{reviewQuantity}</p>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col font-medium">
        <h2 className="flex flex-col text-xs text-black-light dark:text-white-dark">
          {t("posted:")} {dateFormater(reviewCreatedAt, true)}
          {reviewUpdatedAt && (
            <span>
              {t("edited:")} {dateFormater(reviewUpdatedAt, true)}
            </span>
          )}
        </h2>
        <div className="my-1 flex flex-wrap items-center gap-x-2 text-base font-semibold">
          <h1 className="whitespace-nowrap">
            {t("rate:")}{" "}
            <span className="bg-gradient-dark bg-clip-text font-bold text-transparent dark:bg-gradient-light">
              {score}/5
            </span>
          </h1>
          {isLiked && (
            <p className="flex items-center">
              <BsBookmarkHeartFill className="mt-0.5 text-pink/70" />{" "}
              <span className="text-xs font-normal">{t("likes it")}</span>
            </p>
          )}
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
};
