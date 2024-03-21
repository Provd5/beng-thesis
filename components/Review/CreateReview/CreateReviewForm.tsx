"use client";

import { experimental_useOptimistic as useOptimistic, type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import {
  HIGHEST_REVIEW_RATE,
  type ReviewInterface,
  ReviewRatesArray,
} from "~/types/data/review";

import { Button } from "~/components/ui/Buttons";
import { Input } from "~/components/ui/Input";
import { ReviewService } from "~/lib/services/review";
import { GlobalErrors } from "~/lib/validations/errorsEnums";
import { CreateReviewValidator } from "~/lib/validations/review";

import { DeleteReviewForm } from "./DeleteReviewForm";

interface CreateReviewFormProps {
  reviewData: ReviewInterface | null;
}

export const CreateReviewForm: FC<CreateReviewFormProps> = ({ reviewData }) => {
  const t = useTranslations("Reviews.CreateReview");
  const te = useTranslations("Errors");

  const reviewService = new ReviewService();

  const [optimisticReviewDataState, setOptimisticReviewDataState] =
    useOptimistic(
      {
        isReview: !!reviewData,
        text: reviewData ? reviewData.text : null,
        rate: reviewData ? reviewData.rate : null,
      },
      (
        _,
        newLikesState: {
          isReview: boolean;
          text: string | null;
          rate: number | null;
        }
      ) => {
        return newLikesState;
      }
    );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(CreateReviewValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = CreateReviewValidator.parse({
        formData,
      });
      setOptimisticReviewDataState({
        isReview: true,
        ...validData,
      });

      const res = await reviewService.postReview(reviewData?.book_id, formData);

      if (res.ok) toast.success(te(GlobalErrors.SUCCESS));
    } catch (error) {
      toast.error(error as string);
    }
  });

  return (
    <form
      className="flex w-full flex-auto flex-col justify-between gap-2"
      onSubmit={onSubmit}
    >
      <Input
        {...register("text")}
        isTextarea
        loading={isSubmitting}
        id="review-text"
        autoComplete="off"
        minLength={1}
        maxLength={5000}
        className="min-h-[214px] sm:min-h-[180px]"
        placeholder={t("express your opinion")}
        defaultValue={optimisticReviewDataState.text || ""}
      />
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-2 px-2">
        <select className="flex h-fit items-center gap-1">
          {t("your rate")}
          <div className="min-w-[36px] text-right text-lg font-bold">{`${
            optimisticReviewDataState.rate
              ? optimisticReviewDataState.rate
              : "–"
          }/${HIGHEST_REVIEW_RATE}`}</div>
          <div className="flex flex-col gap-1.5 py-1.5 text-md">
            {ReviewRatesArray.map((rate) => (
              <option
                key={rate}
                {...register("rate")}
                id="review-rate"
                value={rate}
                className={clsx(
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full",
                  optimisticReviewDataState.rate === rate &&
                    "font-bold text-secondary dark:text-secondary-light"
                )}
              >
                {rate}
              </option>
            ))}
          </div>
        </select>

        <Button type="submit" size="sm" loading={isSubmitting}>
          {optimisticReviewDataState.isReview ? t("add") : t("edit")}
        </Button>
      </div>
      {optimisticReviewDataState.isReview && (
        <DeleteReviewForm
          reviewId={reviewData?.id}
          setOptimistic={setOptimisticReviewDataState}
        />
      )}
    </form>
  );
};
