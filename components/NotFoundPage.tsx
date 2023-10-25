"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface NotFoundPageProps {
  variant: "page" | "profile" | "book";
}

export const NotFoundPage: FC<NotFoundPageProps> = ({ variant }) => {
  const t = useTranslations("NotFoundPage");

  const router = useRouter();

  return (
    <div className="absolute inset-5 flex items-center justify-center text-white-light dark:text-white">
      <div className="mb-10 max-w-sm text-md">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[68px] font-semibold leading-[78px]">404</h1>
          <h2>{t("not found")} 😵</h2>
        </div>
        <p className="mt-10 px-6 text-center">
          {t(variant)}{" "}
          <span className="font-semibold">{t("doesn't exist")}</span>
        </p>
        <div className="mt-3 flex items-center justify-center text-lg underline">
          <button onClick={() => router.back()}>{t("return")}</button>
        </div>
      </div>
    </div>
  );
};
