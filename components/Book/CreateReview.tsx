"use client";

import { type FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";
import clsx from "clsx";
import { z } from "zod";

import { CreateReviewValidator } from "~/lib/validations/book/createReview";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

import { ModalWrapper } from "../Modals/ModalWrapper";
import { AvatarImage } from "../Profile/AvatarImage";
import { Button, ButtonLink } from "../ui/Buttons";
import { Input } from "../ui/Input";

interface CreateReviewProps {
  avatarUrl: string | null | undefined;
  fullName: string | null | undefined;
  bookId: string;
  isReviewExists: boolean;
  rate: number | undefined;
  text: string | null | undefined;
  closeReview: () => void;
}

export const CreateReview: FC<CreateReviewProps> = ({
  avatarUrl,
  fullName,
  bookId,
  isReviewExists,
  rate,
  text,
  closeReview,
}) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors");

  const rates = [1, 2, 3, 4, 5];

  const [yourRate, setYourRate] = useState<number | undefined>(rate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const reviewTextarea = useRef<HTMLTextAreaElement>(null);
  const openModalButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const handleAddReview = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));
    const textareaInput = reviewTextarea.current;

    const formData = {
      bookId: bookId,
      text:
        textareaInput && textareaInput.value.trim().length > 0
          ? textareaInput.value
          : null,
      rate: yourRate,
    };

    try {
      CreateReviewValidator.parse({ formData: formData });
      if (formData.rate === rate && formData.text === text) {
        closeReview();
        return;
      }

      const { data }: { data: string } = await axios.post(
        `/api/book/manage/review/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        return;
      }

      // on success
      closeReview();
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(te(error.issues[0].message));
      } else {
        toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      }
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[350px] w-full flex-col gap-x-1 gap-y-2 py-3 sm:min-h-[260px] sm:flex-row">
      <div className="flex flex-none items-start gap-1 px-2 sm:w-24 sm:flex-col sm:items-center">
        <AvatarImage
          className="drop-shadow-icon"
          size="sm"
          avatarSrc={avatarUrl || null}
        />
        <h1 className="line-clamp-3 break-all font-bold">{fullName}</h1>
      </div>
      <div className="flex w-full flex-auto flex-col justify-between gap-2">
        <Input
          isTextarea
          loading={isLoading}
          ref={reviewTextarea}
          id="review-textarea"
          name="review-textarea"
          autoComplete="off"
          minLength={1}
          maxLength={5000}
          className="min-h-[214px] sm:min-h-[180px]"
          placeholder={t("express your opinion")}
          defaultValue={text || ""}
        />
        <div className="flex flex-wrap justify-between gap-2 px-2">
          <div className="flex h-fit items-center gap-1">
            <ButtonLink
              ref={openModalButtonRef}
              aria-label="open-modal-button"
              active={isModalOpen}
              className="relative"
              size="lg"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              {t("your rate")}
            </ButtonLink>
            <div className="relative">
              <div className="min-w-[36px] text-right text-lg font-bold">{`${
                yourRate ? yourRate : "–"
              }/5`}</div>
              {isModalOpen && (
                <ModalWrapper
                  size="xs"
                  closeModalHandler={() => setIsModalOpen(false)}
                  openModalButtonRef={openModalButtonRef}
                >
                  <div className="flex flex-col gap-1.5 py-1.5 text-md">
                    {rates.map((rate) => (
                      <button
                        key={rate}
                        className={clsx(
                          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
                          rate === yourRate &&
                            "font-bold text-secondary dark:text-secondary-light"
                        )}
                        onClick={() => (
                          setYourRate(rate), setIsModalOpen(false)
                        )}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </ModalWrapper>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            loading={isLoading}
            onClick={handleAddReview}
          >
            {isReviewExists ? t("edit review") : t("add review")}
          </Button>
        </div>
      </div>
    </div>
  );
};
