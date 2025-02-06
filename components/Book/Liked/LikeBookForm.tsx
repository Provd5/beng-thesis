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
import { postLike } from "~/lib/services/book/actions";
import { dateFormater } from "~/utils/dateFormater";
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
    formats?: Partial<Formats> | undefined,
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

      const res = await postLike(bookId);
      if (!res.success) throw new Error(res.error);
    } catch (e) {
      setLikeState(likeState);
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <button
      className="flex h-fit min-h-[60px] w-[132px] rounded-md bg-white/90 p-1 text-left transition-colors hover:bg-colors-gray/10 dark:bg-black/30 hover:dark:bg-white/10"
      disabled={likeData === undefined}
      onClick={handleLike}
    >
      <div className="flex">
        <div className="flex h-fit">
          {!!likeState.isLike ? (
            <BookmarkIcon category="LIKED" size="lg" />
          ) : (
            <BookmarkIcon Icon={BsBookmarkHeart} color="gradient" size="lg" />
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="px-1 text-base font-semibold text-colors-primary">
            {t("likes")}
          </h3>
          <p className="-mt-1 ml-1 whitespace-nowrap text-sm font-bold">
            {likeState.likesQuantity}
          </p>
          {likeData && (
            <p className="-mt-0.5 ml-1 whitespace-nowrap text-xs text-colors-text">
              {dateFormater(likeData.updated_at)}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};
