"use client";

import { type FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { ModalWrapper } from "~/components/Modals/ModalWrapper";
import { Button } from "~/components/ui/Buttons";
import { ReviewService } from "~/lib/services/review";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

interface DeleteReviewFormProps {
  reviewId: string | undefined;
  setOptimistic: (action: {
    isReview: boolean;
    text: string | null;
    rate: number | null;
  }) => void;
}

export const DeleteReviewForm: FC<DeleteReviewFormProps> = ({
  reviewId,
  setOptimistic,
}) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  if (!reviewId) return;

  const reviewService = new ReviewService();

  const handleDeleteReview = async () => {
    try {
      setOptimistic({
        isReview: false,
        rate: null,
        text: null,
      });

      const res = await reviewService.deleteReview(reviewId);

      if (res.ok) toast.success(te(GlobalErrors.SUCCESS));
    } catch (error) {
      toast.error(error as string);
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
        className={clsx("text-white-light", isModalOpen ? "bg-gray" : "bg-red")}
      >
        {isModalOpen ? t("cancel") : t("delete")}
      </Button>
      {isModalOpen && (
        <ModalWrapper
          closeModalHandler={() => setIsModalOpen(false)}
          openModalButtonRef={openModalButtonRef}
        >
          <div className="flex min-w-[200px] flex-col items-center gap-3">
            <h1 className="text-center text-md">{t("are you sure?")}</h1>
            <Button
              type="submit"
              size="sm"
              onClick={handleDeleteReview}
              defaultColor={false}
              className="bg-red text-white-light"
            >
              {t("delete")}
            </Button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};
