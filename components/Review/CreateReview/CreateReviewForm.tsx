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
import clsx from "clsx";

import {
  HIGHEST_REVIEW_RATE,
  type ReviewInterface,
  ReviewRatesArray,
} from "~/types/data/review";

import { Button } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { postReview } from "~/lib/services/review";
import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { CreateReviewValidator } from "~/lib/validations/review";
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
    formats?: Partial<Formats> | undefined
  ) => string;

  const [reviewDataState, setReviewDataState] = useState({
    isReview: !!reviewData,
    text: reviewData?.text,
    rate: reviewData ? reviewData.rate : null,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
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
              className="flex flex-col gap-1.5 py-1.5 text-md"
              {...register("rate", { valueAsNumber: true })}
              id="review-rate"
            >
              <option value="">–</option>
              {ReviewRatesArray.map((rate) => (
                <option
                  key={rate}
                  className={clsx(
                    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
                    reviewDataState.rate === rate &&
                      "font-bold text-secondary dark:text-secondary-light"
                  )}
                >
                  {rate}
                </option>
              ))}
            </select>
            <span>{`/ ${HIGHEST_REVIEW_RATE}`}</span>
          </div>
        </div>

        <Button type="submit" size="sm" loading={isSubmitting}>
          {reviewDataState.isReview ? t("edit") : t("add")}
        </Button>
      </div>
      {reviewDataState.isReview && (
        <DeleteReviewForm
          reviewId={reviewData?.id}
          setReviewDataState={setReviewDataState}
        />
      )}
    </form>
  );
};
