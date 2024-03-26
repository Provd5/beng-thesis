"use client";

import { type FC, useState } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { BsBookmarkHeart } from "react-icons/bs";

import { type LikedBookInterface } from "~/types/data/book";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { postLike } from "~/lib/services/book";
import { translatableError } from "~/utils/translatableError";

interface LikeBookFormProps {
  bookId: string;
  likeData: LikedBookInterface | null | undefined;
  likesQuantity: number;
}

export const LikeBookForm: FC<LikeBookFormProps> = ({
  bookId,
  likeData,
  likesQuantity,
}) => {
  const t = useTranslations("Book.ManageLikes");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const [likeState, setLikeState] = useState({
    isLike: !!likeData,
    likesQuantity,
  });

  const handleLike = async () => {
    try {
      setLikeState({
        isLike: !likeState.isLike,
        likesQuantity: likeState.isLike
          ? likeState.likesQuantity - 1
          : likeState.likesQuantity + 1,
      });

      await postLike(bookId);
    } catch (e) {
      setLikeState(likeState);
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <button
      className="flex w-fit gap-1 text-left"
      disabled={likeData === undefined}
      onClick={handleLike}
    >
      <div className="flex h-fit">
        {!!likeState.isLike ? (
          <BookmarkIcon category="LIKED" size="lg" />
        ) : (
          <BookmarkIcon Icon={BsBookmarkHeart} color="gradient" size="lg" />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex h-6 items-center">
          <h3 className="text-base font-semibold text-secondary dark:text-secondary-light">
            {t("likes")}
          </h3>
        </div>
        <p>{likeState.likesQuantity}</p>
        {likeData !== undefined && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {!!likeState.isLike ? (
              t("liked")
            ) : (
              <span className="select-none underline">{t("like")}</span>
            )}
          </p>
        )}
      </div>
    </button>
  );
};
