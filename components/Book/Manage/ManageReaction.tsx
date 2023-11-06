import { type FC, useState } from "react";
import toast from "react-hot-toast";
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

import { type ReactionTypeInterface } from "~/types/DataTypes";

import { ReviewReactionValidator } from "~/lib/validations/book/reviewReaction";
import { GlobalErrors } from "~/lib/validations/errorsEnums";

interface ManageReactionProps {
  reaction: ReactionTypeInterface[];
  myReaction: reactionType | undefined;
  reviewId: string;
  userId: string;
}

export const ManageReaction: FC<ManageReactionProps> = ({
  reaction,
  myReaction,
  reviewId,
  userId,
}) => {
  const te = useTranslations("Errors");

  const [reactionsState, setReactionsState] = useState(reaction);
  const [userReactionState, setUserReactionState] = useState(myReaction);

  const filterByReaction = (reaction: reactionType) => {
    return reactionsState.filter((type) => type.reaction === reaction);
  };

  const renderReaction = (
    reaction: reactionType,
    Icon: IconType,
    ActiveIcon: IconType
  ) => {
    return (
      <button
        className={clsx(
          "flex items-center gap-1.5 rounded-sm border px-2 py-1.5 text-md",
          userReactionState === reaction
            ? "border-secondary dark:border-secondary-light"
            : "border-black dark:border-white"
        )}
        onClick={() => handleReaction(reaction)}
      >
        {userReactionState === reaction ? (
          <ActiveIcon className="fill-[var(--svg-gradient-dark)] dark:fill-[var(--svg-gradient)]" />
        ) : (
          <Icon />
        )}
        <p
          className={clsx(
            "min-w-[12px] text-base",
            userReactionState === reaction &&
              "text-secondary dark:text-secondary-light"
          )}
        >
          {filterByReaction(reaction).length}
        </p>
      </button>
    );
  };

  const handleReaction = async (reaction: reactionType) => {
    const prevReactions = reactionsState;
    const prevUserReaction = userReactionState;

    // set active reaction
    setUserReactionState(userReactionState === reaction ? undefined : reaction);

    const index = reactionsState.findIndex(
      (item) => item.reaction === userReactionState
    );
    //removing reaction from array
    reactionsState.splice(index, index !== -1 ? 1 : 0);
    //changing or adding reaction
    userReactionState !== reaction &&
      setReactionsState((prev) => [
        ...prev,
        { reaction, review_id: reviewId, user_id: userId },
      ]);
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
        setUserReactionState(prevUserReaction);
        return;
      }
    } catch (error) {
      toast.error(te(GlobalErrors.SOMETHING_WENT_WRONG));
      setReactionsState(prevReactions);
      setUserReactionState(prevUserReaction);
    }
  };

  return (
    <div className="flex gap-1 px-1 text-black-light dark:text-white-dark">
      {renderReaction("OK", RiThumbUpLine, RiThumbUpFill)}
      {renderReaction("MEH", RiThumbDownLine, RiThumbDownFill)}
    </div>
  );
};
