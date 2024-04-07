"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "~/components/ui/Buttons";
import { cn } from "~/utils/cn";

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
    <div>
      <p
        ref={reviewParagraphRef}
        className={cn(
          "whitespace-break-spaces pl-1 pr-1 text-sm sm:pr-3",
          !isExpanded && "line-clamp-[10]"
        )}
      >
        {reviewText}
      </p>
      {renderButton && (
        <ButtonLink
          className="mt-1"
          size="sm"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          active={isExpanded}
        >
          {isExpanded ? to("collapse") : to("expand")}
        </ButtonLink>
      )}
    </div>
  );
};
