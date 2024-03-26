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
import { type reactionType } from "@prisma/client";
import clsx from "clsx";

import {
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "react-icons/ri";

import { postReaction } from "~/lib/services/review";
import { ReviewReactionValidator } from "~/lib/validations/review";
import { translatableError } from "~/utils/translatableError";

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
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const [reactionState, setReactionState] = useState({
    upQuantity,
    downQuantity,
    sessionReaction,
  });

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: { reaction: sessionReaction },
    resolver: zodResolver(ReviewReactionValidator),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const validReaction = ReviewReactionValidator.parse(formData);

      setReactionState(
        // set reaction
        reactionState.sessionReaction === null
          ? {
              upQuantity:
                validReaction === "OK"
                  ? reactionState.upQuantity + 1
                  : reactionState.upQuantity,
              downQuantity:
                validReaction === "MEH"
                  ? reactionState.downQuantity + 1
                  : reactionState.downQuantity,
              sessionReaction: validReaction,
            }
          : // unset reaction
          reactionState.sessionReaction === validReaction
          ? {
              upQuantity:
                validReaction === "OK"
                  ? reactionState.upQuantity - 1
                  : reactionState.upQuantity,
              downQuantity:
                validReaction === "MEH"
                  ? reactionState.downQuantity - 1
                  : reactionState.downQuantity,
              sessionReaction: validReaction,
            }
          : // change reaction
          validReaction === "OK"
          ? {
              upQuantity: reactionState.upQuantity + 1,
              downQuantity: reactionState.downQuantity - 1,
              sessionReaction: validReaction,
            }
          : {
              upQuantity: reactionState.upQuantity - 1,
              downQuantity: reactionState.downQuantity + 1,
              sessionReaction: validReaction,
            }
      );

      await postReaction(reviewId, formData);
    } catch (e) {
      toast.error(te(translatableError(e)));
    }
  });

  const isActive = (reaction: reactionType) =>
    reactionState.sessionReaction === reaction;

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
              {reactionState.upQuantity}
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
              {reactionState.downQuantity}
            </p>
          </button>
        </div>
      </form>
    </>
  );
};
