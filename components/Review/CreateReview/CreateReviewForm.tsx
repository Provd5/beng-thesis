"use client";

import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  HIGHEST_REVIEW_RATE,
  type ReviewInterface,
  ReviewRatesArray,
} from "~/types/data/review";

import { Button } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { postReview } from "~/lib/services/review/actions";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { CreateReviewValidator } from "~/lib/validations/review";
import { cn } from "~/utils/cn";
import { translatableError } from "~/utils/translatableError";

import { DeleteReviewForm } from "./DeleteReviewForm";

interface CreateReviewFormProps {
  bookId: string;
  reviewData: ReviewInterface | null;
}

export const CreateReviewForm: FC<CreateReviewFormProps> = ({
  bookId,
  reviewData,
}) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined,
  ) => string;

  const [reviewDataState, setReviewDataState] = useState({
    isReview: !!reviewData,
    text: reviewData?.text,
    rate: reviewData ? reviewData.rate : null,
  });

  const {
    register,
    handleSubmit,

    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      text: reviewData?.text,
      rate: reviewData?.rate,
    },
    resolver: zodResolver(CreateReviewValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = CreateReviewValidator.parse(formData);
      setReviewDataState({
        isReview: true,
        text: validData.text,
        rate: validData.rate,
      });

      const res = await postReview(bookId, validData);

      if (res.success) toast.success(te(ErrorsToTranslate.SUCCESS));
    } catch (e) {
      setReviewDataState(reviewDataState);
      toast.error(te(translatableError(e)));
    }
  });

  return (
    <form
      className="flex w-full flex-auto flex-col justify-between gap-2"
      onSubmit={onSubmit}
    >
      <Input
        {...register("text", { minLength: 1, maxLength: 5000 })}
        placeholder={t("express your opinion")}
        autoComplete="off"
        defaultValue={reviewData?.text || ""}
        isTextarea
        id="review-text"
        className="min-h-[214px] sm:min-h-[180px]"
      />
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-2 px-2">
        <div className="flex h-fit items-center gap-1">
          {t("your rate")}
          <div className="flex min-w-[36px] items-center gap-1 text-right text-lg font-bold">
            <select
              className="text-md size-10 cursor-pointer border border-colors-gray/30"
              {...register("rate", { valueAsNumber: true })}
              id="review-rate"
            >
              <option className="hidden" value="" />
              {ReviewRatesArray.map((rate) => (
                <option
                  key={rate}
                  className={cn(
                    "text-center",
                    reviewDataState.rate === rate &&
                      "font-bold text-colors-primary",
                  )}
                >
                  {rate}
                </option>
              ))}
            </select>
            <span>{`/ ${HIGHEST_REVIEW_RATE}`}</span>
          </div>
        </div>
        <div className="relative flex gap-1">
          {reviewDataState.isReview && (
            <DeleteReviewForm
              reviewId={reviewData?.id}
              setReviewDataState={setReviewDataState}
            />
          )}
          {
            <Button
              type="submit"
              size="sm"
              loading={isSubmitting}
              disabled={!isDirty}
              className={cn(
                "transition-colors",
                !isDirty && "bg-colors-gray/20",
              )}
            >
              {reviewDataState.isReview ? t("edit") : t("add")}
            </Button>
          }
        </div>
      </div>
    </form>
  );
};
