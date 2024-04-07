"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface BookReviewCardReactionsLabelProps {
  upReactions: number;
}

export const BookReviewCardReactionsLabel: FC<
  BookReviewCardReactionsLabelProps
> = ({ upReactions }) => {
  const t = useTranslations("Reviews.BookReviewCard");

  return (
    <p>
      {t.rich("users found this review helpful", {
        numUsers: upReactions,
        span: (chunks) => (
          <span className="text-colors-primarytext-colors-primary">
            {chunks}
          </span>
        ),
      })}
    </p>
  );
};
