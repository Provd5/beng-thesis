import type { FC } from "react";
import { useTranslations } from "next-intl";

export const EmptyQuery: FC = ({}) => {
  const t = useTranslations("Search");

  return (
    <div className="mt-6 flex flex-col justify-center gap-3 p-6 text-center text-md text-gray">
      {t("what are you searching for?")} <span className="text-xl">👀</span>
    </div>
  );
};
