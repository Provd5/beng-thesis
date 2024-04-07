"use client";

import { type FC, useState } from "react";
import toast from "react-hot-toast";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { type reactionType } from "@prisma/client";

import {
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "react-icons/ri";

import { postReaction } from "~/lib/services/review";
import { ReviewReactionValidator } from "~/lib/validations/review";
import { cn } from "~/utils/cn";
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

  const handleReaction = async (reaction: reactionType) => {
    try {
      const validReaction = ReviewReactionValidator.parse(reaction);

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
              sessionReaction: null,
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

      await postReaction(reviewId, validReaction);
    } catch (e) {
      toast.error(te(translatableError(e)));
    }
  };

  const isActive = (reaction: reactionType) =>
    reactionState.sessionReaction === reaction;

  return (
    <div className="flex px-1 text-colors-gray">
      <button
        type="submit"
        className={cn(
          "text-md flex items-center gap-1.5 rounded-l-md border border-transparent px-2 py-1.5 transition-colors hover:bg-colors-green/10",
          isActive("OK")
            ? "border-y-colors-green border-l-colors-green"
            : "border-y-colors-gray border-l-colors-gray"
        )}
        onClick={() => handleReaction("OK")}
      >
        {isActive("OK") ? (
          <RiThumbUpFill className="fill-colors-green" />
        ) : (
          <RiThumbUpLine />
        )}
        <p
          className={cn(
            "min-w-[12px] text-base",
            isActive("OK") && "text-colors-green"
          )}
        >
          {reactionState.upQuantity}
        </p>
      </button>
      <hr className="h-full w-px bg-colors-gray" />
      <button
        type="submit"
        className={cn(
          "text-md flex items-center gap-1.5 rounded-r-md border border-transparent px-2 py-1.5 transition-colors hover:bg-colors-red/10",
          isActive("MEH")
            ? "border-y-colors-red border-r-colors-red"
            : "border-y-colors-gray border-r-colors-gray"
        )}
        onClick={() => handleReaction("MEH")}
      >
        {isActive("MEH") ? (
          <RiThumbDownFill className="fill-colors-red" />
        ) : (
          <RiThumbDownLine />
        )}
        <p
          className={cn(
            "min-w-[12px] text-base",
            isActive("MEH") && "text-colors-red"
          )}
        >
          {reactionState.downQuantity}
        </p>
      </button>
    </div>
  );
};
