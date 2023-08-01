"use client";

import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";

import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";

import { LikeBookValidator, LikeResponse } from "~/lib/validations/book/manage";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

import { BookmarksWrapper } from "./BookmarksWrapper";

interface ManageLikesProps {
  bookId: string;
  liked: boolean;
  quantity: number;
}

export const ManageLikes: FC<ManageLikesProps> = ({
  liked,
  quantity,
  bookId,
}) => {
  const t = useTranslations("Book.ManageLikes");
  const te = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likesQuantity, setLikesQuantity] = useState(quantity);
  const router = useRouter();

  const handleLike = async () => {
    setIsLoading(true);
    const wasLiked = isLiked;
    const prevQuantity = likesQuantity;
    setLikesQuantity((prev) => (wasLiked ? prev - 1 : prev + 1));
    setIsLiked(!wasLiked);

    try {
      LikeBookValidator.parse({ bookId: bookId });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/like/`,
        { bookId: bookId }
      );

      // on success
      if (data === LikeResponse.ADDED || data === LikeResponse.REMOVED) {
        router.refresh();

        data === LikeResponse.ADDED
          ? toast(t("added to liked"))
          : toast(t("removed from liked"));
      } else {
        toast.error(te(data));
        setIsLiked(wasLiked);
        setLikesQuantity(prevQuantity);
      }
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setIsLiked(wasLiked);
      setLikesQuantity(prevQuantity);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="flex gap-1">
      <button disabled={isLoading} onClick={handleLike}>
        {isLiked ? (
          <BookmarksWrapper Icon={BsBookmarkHeartFill} color="pink" />
        ) : (
          <BookmarksWrapper Icon={BsBookmarkHeart} color="gradient" />
        )}
      </button>
      <div className="flex flex-col">
        <div className="flex h-[24px] items-center">
          <h3 className="bg-gradient-dark bg-clip-text text-base font-semibold text-transparent dark:bg-gradient-light">
            {t("likes")}
          </h3>
        </div>
        <p>{likesQuantity}</p>
        <p className="text-xs text-black-light dark:text-white-dark">
          {isLiked ? (
            t("liked")
          ) : (
            <span
              onClick={handleLike}
              className={isLoading ? "" : "cursor-pointer underline"}
            >
              {t("like")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
