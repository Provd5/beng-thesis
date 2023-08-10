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

interface CreateReviewProps {
  avatarUrl: string | null | undefined;
  fullName: string | null | undefined;
  bookId: string;
  isReviewExists: boolean;
  score?: number;
  text?: string;
  pullReviewState: (data: boolean) => void;
}

export const CreateReview: FC<CreateReviewProps> = ({
  avatarUrl,
  fullName,
  bookId,
  isReviewExists,
  score,
  text,
  pullReviewState,
}) => {
  const t = useTranslations("Book.CreateReview");
  const te = useTranslations("Errors");

  const scoreValues = [1, 2, 3, 4, 5];

  const [yourScore, setYourScore] = useState<number | undefined>(score);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const reviewTextarea = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const handleAddReview = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading(te(GlobalErrors.PENDING));

    const formData = {
      bookId: bookId,
      text: reviewTextarea.current?.value,
      score: yourScore,
    };

    try {
      CreateReviewValidator.parse({ formData: formData });
      if (formData.score === score && formData.text === text) {
        pullReviewState(false);
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
      pullReviewState(false);
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
    <div className="relative flex min-h-[360px] w-full flex-col gap-x-1 gap-y-2 py-3 sm:min-h-[280px] sm:flex-row">
      <div className="flex flex-none items-start gap-1 px-2 sm:w-24 sm:flex-col sm:items-center">
        <AvatarImage
          className="drop-shadow-icon"
          size="sm"
          avatarSrc={avatarUrl}
        />
        <h1 className="line-clamp-3 break-all font-bold">{fullName}</h1>
      </div>
      <div className="flex w-full flex-auto flex-col justify-between gap-2">
        <textarea
          ref={reviewTextarea}
          id="review-textarea"
          name="review"
          autoComplete="off"
          minLength={1}
          maxLength={5000}
          className="min-h-[214px] rounded-l-md rounded-tr-md p-3 sm:min-h-[198px]"
          placeholder={t("express your opinion")}
          defaultValue={text || ""}
        />
        <div className="flex flex-wrap justify-between gap-2 px-2">
          <div className="flex h-fit items-center gap-1">
            <ButtonLink
              active={isModalOpen}
              className="relative"
              size="lg"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              {t("your score")}
            </ButtonLink>
            <div className="relative">
              <div className="min-w-[36px] text-right text-lg font-bold">{`${
                yourScore ? yourScore : "–"
              }/5`}</div>
              {isModalOpen && (
                <ModalWrapper
                  size="xs"
                  closeModalHandler={() => setIsModalOpen(false)}
                >
                  <div className="flex flex-col gap-0.5 py-1.5 text-base">
                    {scoreValues.map((score) => (
                      <button
                        key={score}
                        className={clsx(
                          "flex h-6 w-7 cursor-pointer items-center justify-center",
                          score === yourScore &&
                            "font-bold text-secondary dark:text-secondary-light"
                        )}
                        onClick={() => (
                          setYourScore(score), setIsModalOpen(false)
                        )}
                      >
                        {score}
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
