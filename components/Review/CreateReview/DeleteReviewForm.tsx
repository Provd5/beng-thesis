"use client";

import { type FC, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";

import { FaTrash } from "react-icons/fa";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { Button } from "~/components/ui/Buttons";
import { deleteReview } from "~/lib/services/review/actions";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { translatableError } from "~/utils/translatableError";

interface DeleteReviewFormProps {
  reviewId: string | undefined;
}

export const DeleteReviewForm: FC<DeleteReviewFormProps> = ({ reviewId }) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  if (!reviewId) return;

  const handleDeleteReview = () => {
    try {
      startTransition(async () => {
        const res = await deleteReview(reviewId);
        if (!res.success) throw new Error(res.error);

        const reviewTextarea = document.getElementById(
          "review-text",
        ) as HTMLTextAreaElement | null;
        const reviewRateSelect = document.getElementById(
          "review-rate",
        ) as HTMLSelectElement | null;

        if (reviewTextarea && reviewRateSelect) {
          reviewTextarea.value = "";
          reviewRateSelect.value = "";
        }
        toast.success(te(ErrorsToTranslate.SUCCESS));
      });
    } catch (e) {
      toast.error(te(translatableError(e)));
    }
  };

  return (
    <>
      <Button
        ref={openModalButtonRef}
        type="button"
        size="icon"
        onClick={() => setIsModalOpen(!isModalOpen)}
        defaultColor={false}
        className="bg-colors-red text-white"
        disabled={isModalOpen || isPending}
      >
        <FaTrash />
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
                loading={isPending}
              >
                {t("delete")}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                defaultColor={false}
                className="bg-colors-gray text-white"
                disabled={isPending}
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
