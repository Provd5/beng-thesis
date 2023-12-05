import { type FC, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type reactionType } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";

import { type IconType } from "react-icons";
import {
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
} from "react-icons/ri";

import { type ReviewReactionsInterface } from "~/types/feed/ReviewCardDataInterface";

import { ReviewReactionValidator } from "~/lib/validations/book/reviewReaction";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

interface ManageReactionProps {
  reviewReactions: ReviewReactionsInterface;
  reviewId: string;
}

export const ManageReaction: FC<ManageReactionProps> = ({
  reviewReactions,
  reviewId,
}) => {
  const te = useTranslations("Errors");

  const router = useRouter();

  const [reactionsState, setReactionsState] = useState(reviewReactions);

  const renderReaction = (
    reaction: reactionType,
    Icon: IconType,
    ActiveIcon: IconType
  ) => {
    return (
      <button
        className={clsx(
          "flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-md",
          reactionsState.myReaction === reaction
            ? reaction === "OK"
              ? "border-green"
              : "border-red"
            : "border-black dark:border-white"
        )}
        onClick={() => handleReaction(reaction)}
      >
        {reactionsState.myReaction === reaction ? (
          <ActiveIcon
            className={reaction === "OK" ? "fill-green" : "fill-red"}
          />
        ) : (
          <Icon />
        )}
        <p
          className={clsx(
            "min-w-[12px] text-base",
            reactionsState.myReaction === reaction &&
              (reaction === "OK" ? "text-green" : "text-red")
          )}
        >
          {reactionsState[reaction]}
        </p>
      </button>
    );
  };

  const handleReaction = async (reaction: reactionType) => {
    const prevReactions = reactionsState;

    setReactionsState((prev) =>
      // set new reaction
      prev.myReaction === undefined
        ? {
            ...prev,
            myReaction: reaction,
            [reaction]: prev[reaction] + 1,
          }
        : // unset reaction
        prev.myReaction === reaction
        ? {
            ...prev,
            myReaction: undefined,
            [reaction]: prev[reaction] === 0 ? 0 : prev[reaction] - 1,
          }
        : // change reaction
        reaction === "OK"
        ? {
            ...prev,
            myReaction: reaction,
            MEH: prev.MEH === 0 ? 0 : prev.MEH - 1,
            OK: prev.OK + 1,
          }
        : {
            ...prev,
            myReaction: reaction,
            OK: prev.OK === 0 ? 0 : prev.OK - 1,
            MEH: prev.MEH + 1,
          }
    );

    const formData = { reviewId: reviewId, reaction: reaction };

    try {
      ReviewReactionValidator.parse({
        formData: formData,
      });
      const { data }: { data: string } = await axios.post(
        `/api/book/manage/review/reaction/`,
        { formData: formData }
      );

      if (data !== GlobalErrors.SUCCESS) {
        toast.error(te(data));
        setReactionsState(prevReactions);
        return;
      }

      // on success
      router.refresh();
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setReactionsState(prevReactions);
    }
  };

  return (
    <div className="flex gap-1 px-1 text-black-light dark:text-white-dark">
      {renderReaction("OK", RiThumbUpLine, RiThumbUpFill)}
      {renderReaction("MEH", RiThumbDownLine, RiThumbDownFill)}
    </div>
  );
};
