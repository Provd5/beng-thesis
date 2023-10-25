"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type reactionType } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";

import { type IconType } from "react-icons";
import { FaFaceLaughBeam, FaFaceMeh } from "react-icons/fa6";

import { ReviewReactionValidator } from "~/lib/validations/book/reviewReaction";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { dateFormater } from "~/utils/dateFormater";

import { AvatarImage } from "../Profile/AvatarImage";
import { ButtonLink } from "../ui/Buttons";
import { getBookmarkIcon } from "../ui/getBookmarkIcon";

interface ReviewProps {
  id: string;
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
  text: string | null;
  isLiked: boolean;
  reactions: {
    reaction: reactionType;
  }[];
  userReaction: reactionType | undefined;
  isMyReview?: boolean;
}

export const Review: FC<ReviewProps> = ({
  id,
  profileData,
  reviewCreatedAt,
  reviewUpdatedAt,
  isLiked,
  score,
  text,
  reactions,
  userReaction,
  isMyReview,
}) => {
  const t = useTranslations("Reviews.Review");
  const to = useTranslations("Other");
  const te = useTranslations("Errors");

  const filterReaction = (reaction: reactionType) => {
    const filterArrayByReaction = reactionsState.filter(
      (type) => type.reaction === reaction
    );
    return filterArrayByReaction;
  };

  const [reactionsState, setReactionsState] = useState(reactions);
  const [userReactionState, setUserReactionState] = useState(userReaction);

  const [renderButton, setRenderButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const reviewParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      reviewParagraphRef.current &&
      reviewParagraphRef.current.clientHeight >= 122
    ) {
      setRenderButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewParagraphRef.current]);

  const renderReaction = (reaction: reactionType, Icon: IconType) => {
    return (
      <button
        className={clsx(
          "flex items-center gap-1 rounded-sm border px-2 py-1.5",
          userReactionState === reaction
            ? "border-secondary dark:border-secondary-light"
            : "border-black dark:border-white"
        )}
        onClick={() => handleReaction(reaction)}
      >
        <Icon
          className={
            userReactionState === reaction
              ? "fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]"
              : ""
          }
        />
        <div
          className={clsx(
            "flex gap-2 font-semibold",
            userReactionState === reaction &&
              "text-secondary dark:text-secondary-light"
          )}
        >
          <p>{t(reaction)}</p>
          <p>{filterReaction(reaction).length}</p>
        </div>
      </button>
    );
  };

  const handleReaction = async (reaction: reactionType) => {
    const prevReactions = reactionsState;
    const prevUserReaction = userReactionState;

    // set active reaction
    setUserReactionState(userReactionState === reaction ? undefined : reaction);

    const index = reactionsState.findIndex(
      (item) => item.reaction === userReactionState
    );
    //removing reaction from array
    reactionsState.splice(index, index !== -1 ? 1 : 0);
    //changing or adding reaction
    userReactionState !== reaction &&
      setReactionsState((prev) => [...prev, { reaction }]);

    const formData = { reviewId: id, reaction: reaction };

    try {
      ReviewReactionValidator.parse({
        formData: formData,
      });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/review/reaction/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setReactionsState(prevReactions);
        setUserReactionState(prevUserReaction);
        return;
      }
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setReactionsState(prevReactions);
      setUserReactionState(prevUserReaction);
    }
  };

  return (
    <div
      className={clsx(
        "relative flex w-full flex-col gap-1 py-3 sm:flex-row",
        isMyReview &&
          "min-h-[346px] before:pointer-events-none before:absolute before:inset-x-[-10px] before:inset-y-0 before:bg-yellow/5 sm:min-h-[256px] before:sm:rounded-md"
      )}
    >
      <Link
        href={profileData.full_name ? `/profile/${profileData.full_name}` : "#"}
        className="flex h-fit flex-none gap-x-1.5 gap-y-1 sm:w-24 sm:flex-col sm:items-center"
      >
        <AvatarImage
          className="drop-shadow-icon"
          avatarSrc={profileData.avatar_url}
        />
        <div className="flex flex-col gap-0.5 sm:items-center">
          <h1 className="line-clamp-3 break-all font-bold">
            {profileData.full_name}
          </h1>
          <h2 className="flex flex-wrap text-xs text-black-light dark:text-white-dark sm:justify-center">
            {t("joined:")} <span>{dateFormater(profileData.created_at)}</span>
          </h2>
          <div className="my-1 flex gap-2 text-base">
            <div className="flex items-center gap-0.5">
              {getBookmarkIcon("ALREADY_READ", "sm")}
              <p>{profileData._count.bookshelf}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {getBookmarkIcon("REVIEWS", "sm")}
              <p>{profileData._count.review}</p>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex w-full flex-auto flex-col justify-between">
        <div>
          <h2 className="flex flex-col text-xs text-black-light dark:text-white-dark">
            {t("posted:")} {dateFormater(reviewCreatedAt, true)}
            {reviewUpdatedAt && (
              <span>
                {t("edited:")} {dateFormater(reviewUpdatedAt, true)}
              </span>
            )}
          </h2>
          <div className="my-1 flex flex-wrap items-center gap-x-2 text-base">
            <h1 className="whitespace-nowrap font-semibold">
              {t("rate:")}{" "}
              <span className="font-bold text-secondary dark:text-secondary-light">
                {`${score}/5`}
              </span>
            </h1>
            {isLiked && (
              <div className="flex items-center gap-0.5">
                {getBookmarkIcon("LIKED", "sm")}
                <span className="text-xs">{t("likes it")}</span>
              </div>
            )}
          </div>
          <p
            ref={reviewParagraphRef}
            className={clsx(
              "pl-1 pr-1 text-sm sm:pr-3",
              !isExpanded && "line-clamp-[10] max-h-[122px]"
            )}
          >
            {text}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap justify-between">
          {renderButton ? (
            <ButtonLink
              size="sm"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
              active={isExpanded}
            >
              {isExpanded ? to("collapse") : to("expand")}
            </ButtonLink>
          ) : (
            <div />
          )}
          {text && (
            <div className="flex flex-col items-end gap-1">
              <p className="text-right text-xs">
                {t("was this review helpful?")}
              </p>
              <div className="flex gap-1 px-1 text-sm text-black-light dark:text-white-dark">
                {renderReaction("OK", FaFaceLaughBeam)}
                {renderReaction("MEH", FaFaceMeh)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
