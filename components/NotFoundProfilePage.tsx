"use client";

import type { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const NotFoundProfilePage: FC = () => {
  const t = useTranslations("NotFoundProfilePage");

  return (
    <div className="absolute inset-5 flex items-center justify-center text-white-light dark:text-white">
      <div className="mb-10 max-w-sm text-md">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[68px] font-semibold leading-[78px]">404</h1>
          <p>{t("not found")} 😵</p>
        </div>
        <p className="my-10 text-center">
          {t.rich("not found message", {
            s: (chunks) => <span className="font-semibold">{chunks}</span>,
          })}
        </p>
        <Link href={`/profile`}>
          <div className="flex items-center justify-center text-xs underline">
            {t("back to your profile")}
          </div>
        </Link>
      </div>
    </div>
  );
};
