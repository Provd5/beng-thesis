"use client";

import { type FC, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

import { BsBookmarkHeart } from "react-icons/bs";

import { LikeBookValidator } from "~/lib/validations/book/likeBook";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

import { BookmarksWrapper } from "../../ui/BookmarksWrapper";
import { getBookmarkIcon } from "../../ui/getBookmarkIcon";

interface ManageLikesProps {
  bookId: string;
  doILikeThisBook: boolean;
  likesQuantity: number;
}

export const ManageLikes: FC<ManageLikesProps> = ({
  doILikeThisBook,
  likesQuantity,
  bookId,
}) => {
  const t = useTranslations("Book.ManageLikes");
  const te = useTranslations("Errors");

  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(doILikeThisBook);
  const [likesQuantityState, setLikesQuantityState] = useState(likesQuantity);

  const handleLike = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));
    const wasLiked = isLiked;
    const prevQuantity = likesQuantity;
    setLikesQuantityState((prev) => (wasLiked ? prev - 1 : prev + 1));
    setIsLiked(!wasLiked);

    try {
      LikeBookValidator.parse({ bookId: bookId });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/like/`,
        { bookId: bookId }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setIsLiked(wasLiked);
        setLikesQuantityState(prevQuantity);
        return;
      }

      // success
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setIsLiked(wasLiked);
      setLikesQuantityState(prevQuantity);
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-fit cursor-pointer gap-1" onClick={handleLike}>
      <button className="flex h-fit" disabled={isLoading} onClick={handleLike}>
        {isLiked ? (
          getBookmarkIcon("LIKED", "lg")
        ) : (
          <BookmarksWrapper Icon={BsBookmarkHeart} color="gradient" size="lg" />
        )}
      </button>
      <div className="flex flex-col">
        <div className="flex h-[24px] items-center">
          <h3 className="text-base font-semibold text-secondary dark:text-secondary-light">
            {t("likes")}
          </h3>
        </div>
        <p>{likesQuantityState}</p>
        <p className="text-xs text-black-light dark:text-white-dark">
          {isLiked ? (
            t("liked")
          ) : (
            <span className={isLoading ? "" : "select-none underline"}>
              {t("like")}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
