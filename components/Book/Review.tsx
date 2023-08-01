"use client";

import { type FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type reactionType } from "@prisma/client";
import clsx from "clsx";

import {
  BsBookmarkHeartFill,
  BsBookmarkStarFill,
  BsFillBookmarkCheckFill,
} from "react-icons/bs";
import { FaFaceLaughBeam, FaFaceMeh } from "react-icons/fa6";

import { dateFormater } from "~/utils/dateFormater";

import { AvatarImage } from "../Profile/AvatarImage";
import { ButtonLink } from "../ui/Buttons";

interface ReviewProps {
  profileData: {
    avatar_url: string | null;
    full_name: string | null;
    created_at: Date;
    _count: {
      bookshelf: number;
      review: number;
    };
  };
  reviewCreatedAt: Date;
  reviewUpdatedAt: Date | null;
  score: number;
  isLiked: boolean;
  text: string;
  reactions: {
    reaction: reactionType;
    user_id: string;
    review_id: string;
  }[];
  isMyReview?: boolean;
}

export const Review: FC<ReviewProps> = ({
  profileData,
  reviewCreatedAt,
  reviewUpdatedAt,
  score,
  isLiked,
  text,
  reactions,
  isMyReview,
}) => {
  const t = useTranslations("Book.Review");

  const [renderButton, setRenderButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const reviewParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      reviewParagraphRef.current &&
      reviewParagraphRef.current.clientHeight >= 152
    ) {
      setRenderButton(true);
    }
  }, []);

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col gap-1 py-3 sm:flex-row",
        isMyReview &&
          "min-h-[260px] before:pointer-events-none before:absolute before:inset-x-[-10px] before:inset-y-0 before:bg-yellow/5 sm:min-h-[215px] before:sm:rounded-md"
      )}
    >
      <Link
        href={profileData.full_name ? `/profile/${profileData.full_name}` : "#"}
        className="flex shrink-0 gap-x-1.5 gap-y-1 font-medium sm:w-24 sm:flex-col sm:items-center"
      >
        <AvatarImage
          className="drop-shadow-icon"
          avatarSrc={profileData.avatar_url}
        />
        <div className="flex flex-col gap-0.5 sm:items-center">
          <h1 className="line-clamp-3 break-all font-semibold">
            {profileData.full_name}
          </h1>
          <h2 className="flex flex-wrap text-xs text-black-light dark:text-white-dark sm:justify-center">
            {t("joined:")} <span>{dateFormater(profileData.created_at)}</span>
          </h2>
          <div className="my-1 flex gap-2 text-base">
            <div className="flex items-center gap-0.5">
              <BsFillBookmarkCheckFill className="text-green/70" />
              <p>{profileData._count.bookshelf}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <BsBookmarkStarFill className="text-yellow/70" />
              <p>{profileData._count.review}</p>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex w-full flex-auto flex-col justify-between font-medium">
        <div>
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
                {`${score}/5`}
              </span>
            </h1>
            {isLiked && (
              <p className="flex items-center">
                <BsBookmarkHeartFill className="mt-0.5 text-pink/70" />{" "}
                <span className="text-xs font-normal">{t("likes it")}</span>
              </p>
            )}
          </div>
          <p
            ref={reviewParagraphRef}
            className={clsx(
              "px-1.5",
              !isExpanded && "line-clamp-[10] max-h-[152px]"
            )}
          >
            {text}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap justify-between">
          {renderButton ? (
            <ButtonLink
              size="sm"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
              active={isExpanded}
            >
              {isExpanded ? t("collapse") : t("expand")}
            </ButtonLink>
          ) : (
            <div />
          )}
          <div className="flex flex-col items-end gap-1">
            <p className="text-right text-xs">{t("was this review useful?")}</p>
            <div className="flex gap-5 px-1 text-black-light dark:text-white-dark">
              <div className="flex items-center gap-1">
                <FaFaceLaughBeam />
                <p>
                  {t("yes")} –{" "}
                  {reactions.filter((type) => type.reaction === "OK").length}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <FaFaceMeh />
                <p>
                  {t("no")} –{" "}
                  {reactions.filter((type) => type.reaction === "MEH").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
