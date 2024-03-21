"use client";

import { experimental_useOptimistic as useOptimistic, type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { type reactionType } from "@prisma/client";
import clsx from "clsx";

import {
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "react-icons/ri";

import { ReviewService } from "~/lib/services/review";
import { ReviewReactionValidator } from "~/lib/validations/review";

interface HandleSubmitReactionProps {
  reviewId: string;
  upQuantity: number;
  downQuantity: number;
  sessionReaction: reactionType | null;
}

export const HandleSubmitReaction: FC<HandleSubmitReactionProps> = ({
  reviewId,
  upQuantity,
  downQuantity,
  sessionReaction,
}) => {
  const reviewService = new ReviewService();

  const [optimisticReactionState, setOptimisticReactionState] = useOptimistic(
    {
      upQuantity,
      downQuantity,
      sessionReaction,
    },
    (
      _,
      newLikesState: {
        upQuantity: number;
        downQuantity: number;
        sessionReaction: reactionType | null;
      }
    ) => {
      return newLikesState;
    }
  );

  const { register, setValue, handleSubmit } = useForm({
    resolver: zodResolver(ReviewReactionValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validData = ReviewReactionValidator.parse({
        reviewId,
        ...formData,
      });

      setOptimisticReactionState(
        // set reaction
        optimisticReactionState.sessionReaction === null
          ? {
              upQuantity:
                validData.reaction === "OK"
                  ? optimisticReactionState.upQuantity + 1
                  : optimisticReactionState.upQuantity,
              downQuantity:
                validData.reaction === "MEH"
                  ? optimisticReactionState.downQuantity + 1
                  : optimisticReactionState.downQuantity,
              sessionReaction: validData.reaction,
            }
          : // unset reaction
          optimisticReactionState.sessionReaction === validData.reaction
          ? {
              upQuantity:
                validData.reaction === "OK"
                  ? optimisticReactionState.upQuantity - 1
                  : optimisticReactionState.upQuantity,
              downQuantity:
                validData.reaction === "MEH"
                  ? optimisticReactionState.downQuantity - 1
                  : optimisticReactionState.downQuantity,
              sessionReaction: validData.reaction,
            }
          : // change reaction
          validData.reaction === "OK"
          ? {
              upQuantity: optimisticReactionState.upQuantity + 1,
              downQuantity: optimisticReactionState.downQuantity - 1,
              sessionReaction: validData.reaction,
            }
          : {
              upQuantity: optimisticReactionState.upQuantity - 1,
              downQuantity: optimisticReactionState.downQuantity + 1,
              sessionReaction: validData.reaction,
            }
      );

      await reviewService.postReaction(reviewId, formData);
    } catch (error) {
      toast.error(error as string);
    }
  });

  const isActive = (reaction: reactionType) =>
    optimisticReactionState.sessionReaction === reaction;

  return (
    <>
      <form
        className="flex gap-1 px-1 text-black-light dark:text-white-dark"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col items-end gap-1">
          <button
            {...register("reaction")}
            type="submit"
            className={clsx(
              "flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-md",
              isActive("OK") ? "border-green" : "border-black dark:border-white"
            )}
            onClick={() => setValue("reaction", "OK")}
          >
            {isActive("OK") ? (
              <RiThumbUpFill className="fill-green" />
            ) : (
              <RiThumbUpLine />
            )}
            <p
              className={clsx(
                "min-w-[12px] text-base",
                isActive("OK") && "text-green"
              )}
            >
              {optimisticReactionState.upQuantity}
            </p>
          </button>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            {...register("reaction")}
            type="submit"
            className={clsx(
              "flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-md",
              isActive("MEH") ? "border-red" : "border-black dark:border-white"
            )}
            onClick={() => setValue("reaction", "MEH")}
          >
            {isActive("MEH") ? (
              <RiThumbDownFill className="fill-red" />
            ) : (
              <RiThumbDownLine />
            )}
            <p
              className={clsx(
                "min-w-[12px] text-base",
                isActive("MEH") && "text-red"
              )}
            >
              {optimisticReactionState.downQuantity}
            </p>
          </button>
        </div>
      </form>
    </>
  );
};
