"use client";

import { type FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { Button } from "~/components/ui/Buttons";
import { deleteReview } from "~/lib/services/review";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { translatableError } from "~/utils/translatableError";

interface DeleteReviewFormProps {
  reviewId: string | undefined;
  setReviewDataState: (data: {
    isReview: boolean;
    text: string | null;
    rate: number | null;
  }) => void;
}

export const DeleteReviewForm: FC<DeleteReviewFormProps> = ({
  reviewId,
  setReviewDataState,
}) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  if (!reviewId) return;

  const handleDeleteReview = async () => {
    try {
      setReviewDataState({
        isReview: false,
        rate: null,
        text: null,
      });

      const res = await deleteReview(reviewId);

      if (res.success) toast.success(te(ErrorsToTranslate.SUCCESS));
    } catch (e) {
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <>
      <Button
        ref={openModalButtonRef}
        type="button"
        size="sm"
        onClick={() => setIsModalOpen(!isModalOpen)}
        defaultColor={false}
        className="bg-colors-red text-white"
        disabled={isModalOpen}
      >
        {t("delete")}
      </Button>
      {isModalOpen && (
        <ModalWrapper
          closeModalHandler={() => setIsModalOpen(false)}
          openModalButtonRef={openModalButtonRef}
        >
          <div className="flex min-w-[200px] flex-col items-center gap-3">
            <h1 className="text-md text-center">{t("are you sure?")}</h1>
            <div className="flex gap-3">
              <Button
                type="submit"
                size="sm"
                onClick={handleDeleteReview}
                defaultColor={false}
                className="bg-colors-red text-white"
              >
                {t("delete")}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                defaultColor={false}
                className="bg-colors-gray text-white"
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};
