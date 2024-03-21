"use client";

import { experimental_useOptimistic as useOptimistic, type FC } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { BsBookmarkHeart } from "react-icons/bs";

import { type LikedBookInterface } from "~/types/data/book";

import { BookmarkIcon } from "~/components/ui/Icons/BookmarkIcon";
import { BookService } from "~/lib/services/book";

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

  const bookService = new BookService();

  const [optimisticLikeDataState, setOptimisticLikeDataState] = useOptimistic(
    { isLike: !!likeData, likesQuantity },
    (
      _,
      newLikesState: {
        isLike: boolean;
        likesQuantity: number;
      }
    ) => {
      return newLikesState;
    }
  );

  const handleLike = async () => {
    try {
      setOptimisticLikeDataState({
        isLike: !optimisticLikeDataState.isLike,
        likesQuantity: optimisticLikeDataState.isLike
          ? optimisticLikeDataState.likesQuantity - 1
          : optimisticLikeDataState.likesQuantity + 1,
      });

      await bookService.postLike(bookId);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <button
      className="flex w-fit gap-1 text-left"
      disabled={likeData === undefined}
      onClick={handleLike}
    >
      <div className="flex h-fit">
        {!!optimisticLikeDataState.isLike ? (
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
        <p>{optimisticLikeDataState.likesQuantity}</p>
        {likeData !== undefined && (
          <p className="text-xs text-black-light dark:text-white-dark">
            {!!optimisticLikeDataState.isLike ? (
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
