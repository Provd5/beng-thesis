"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { cn } from "~/utils/cn";

import { ButtonLink } from "../ui/Buttons";

type variantTypes =
  | "pages:"
  | "publisher:"
  | "release date:"
  | "genre:"
  | "average rate:"
  | "description:";

interface BookDetailsProps {
  text: string;
  variant: variantTypes;
}

export const BookDetails: FC<BookDetailsProps> = ({ text, variant }) => {
  const t = useTranslations("Book.Details");
  const to = useTranslations("Other");

  const [renderButton, setRenderButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionParagraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      descriptionParagraphRef.current &&
      descriptionParagraphRef.current.clientHeight >= 58
    ) {
      setRenderButton(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptionParagraphRef.current]);

  switch (variant) {
    case "average rate:":
      return (
        <div className="flex flex-col gap-0.5 font-semibold">
          <h3 className="text-base text-colors-primary">{t(variant)}</h3>
          <p className="text-xl">{text}</p>
        </div>
      );
    case "description:":
      return (
        <div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{t(variant)}</h3>
            <p
              ref={descriptionParagraphRef}
              className={cn(
                "whitespace-break-spaces",
                !isExpanded && "line-clamp-4"
              )}
            >
              {text}
            </p>
          </div>
          {renderButton && (
            <ButtonLink
              className="mx-auto mt-1"
              size="sm"
              active={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? to("collapse") : to("expand")}
            </ButtonLink>
          )}
        </div>
      );

    default:
      return (
        <div className="flex flex-wrap gap-1">
          <h3 className="font-semibold">{t(variant)}</h3>
          <p>{text}</p>
        </div>
      );
  }
};
