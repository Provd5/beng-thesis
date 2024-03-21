"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { ButtonLink } from "~/components/ui/Buttons";

interface ReviewTextProps {
  reviewText: string;
}

export const ReviewText: FC<ReviewTextProps> = ({ reviewText }) => {
  const to = useTranslations("Other");

  const [renderButton, setRenderButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const reviewParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      reviewParagraphRef.current &&
      reviewParagraphRef.current.clientHeight >= 122
    ) {
      setRenderButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewParagraphRef.current]);

  return (
    <>
      <p
        ref={reviewParagraphRef}
        className={clsx(
          "whitespace-break-spaces pl-1 pr-1 text-sm sm:pr-3",
          !isExpanded && "line-clamp-[10] max-h-[122px]"
        )}
      >
        {reviewText}
      </p>
      {renderButton ? (
        <ButtonLink
          size="sm"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          active={isExpanded}
        >
          {isExpanded ? to("collapse") : to("expand")}
        </ButtonLink>
      ) : (
        <div />
      )}
    </>
  );
};
