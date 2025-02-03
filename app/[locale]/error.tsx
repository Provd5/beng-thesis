"use client";

import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");

  return (
    <div className="absolute inset-5 flex items-center justify-center text-black dark:text-white">
      <div className="text-md mb-10 max-w-sm">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold">
            {t("something went wrong")} 😵
          </h2>
        </div>
        <p className="mt-10 px-6 text-center">
          <span className="font-semibold">{error.message}</span>
        </p>
        <div className="mt-3 flex items-center justify-center text-lg underline">
          <button onClick={() => reset()}>{t("try again")}</button>
        </div>
      </div>
    </div>
  );
}
