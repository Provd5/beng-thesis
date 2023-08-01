"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "../ui/Buttons";

type variantTypes =
  | "pages:"
  | "publisher:"
  | "release date:"
  | "genre:"
  | "averge score:"
  | "description:";

interface BookDetailsProps {
  text: string;
  variant: variantTypes;
}

export const BookDetails: FC<BookDetailsProps> = ({ text, variant }) => {
  const t = useTranslations("Book.Details");

  const [renderButton, setRenderButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionParagraphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      descriptionParagraphRef.current &&
      descriptionParagraphRef.current.clientHeight >= 56
    ) {
      setRenderButton(true);
    }
  }, []);

  switch (variant) {
    case "averge score:":
      return (
        <div className="flex flex-col gap-0.5">
          <h3 className="bg-gradient-dark bg-clip-text font-semibold text-transparent dark:bg-gradient-light">
            {t(variant)}
          </h3>
          <p className="text-md font-medium">{text}</p>
        </div>
      );
    case "description:":
      return (
        <div>
          <div className="flex flex-col gap-1">
            <h3 className="font-medium">{t(variant)}</h3>
            <p
              ref={descriptionParagraphRef}
              className={isExpanded ? "" : "line-clamp-4 max-h-[56px]"}
            >
              {text}
            </p>
          </div>
          {renderButton && (
            <ButtonLink
              className="mx-auto"
              size="sm"
              active={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? t("show less") : t("show more")}
            </ButtonLink>
          )}
        </div>
      );

    default:
      return (
        <div className="flex flex-wrap gap-1">
          <h3 className="font-medium">{t(variant)}</h3>
          <p>{text}</p>
        </div>
      );
  }
};
