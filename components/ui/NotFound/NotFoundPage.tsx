"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import ROUTES from "~/utils/routes";

interface NotFoundPageProps {
  variant: "page" | "profile" | "book";
}

export const NotFoundPage: FC<NotFoundPageProps> = ({ variant }) => {
  const t = useTranslations("NotFound.NotFoundPage");

  const router = useRouter();

  return (
    <div className="absolute inset-5 flex items-center justify-center text-black dark:text-white">
      <div className="text-md mb-10 max-w-sm">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[68px] font-semibold leading-[78px]">404</h1>
          <h2>{t("not found")} 😵</h2>
        </div>
        <p className="mt-10 px-6 text-center">
          {t(variant)}{" "}
          <span className="font-semibold">{t("doesn't exist")}</span>
        </p>
        <div className="mt-3 flex items-center justify-center text-lg underline">
          <button onClick={() => router.replace(ROUTES.root)}>
            {t("return")}
          </button>
        </div>
      </div>
    </div>
  );
};
