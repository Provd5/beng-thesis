"use client";

import { type FC, useRef } from "react";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { MdKeyboardArrowDown } from "react-icons/md";

import { SearchCategoriesArray } from "~/types/search";

import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { SearchEngine } from "./SearchEngine";

interface SearchComponentProps {
  searchParams: ReadonlyURLSearchParams;
}

export const SearchComponent: FC<SearchComponentProps> = ({ searchParams }) => {
  const t = useTranslations("Search");

  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const validSearchCategory = searchCategoryValidator(searchParams);

  const changeCategory = (searchCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    params.delete("q");
    params.set("category", searchCategory);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-t-3xl border-b border-white-light bg-white dark:border-black-dark dark:bg-black md:rounded-none">
      <div className="container flex h-full w-full items-center justify-center px-8 py-3">
        <div className="flex w-full flex-col-reverse xs:flex-row xs:justify-end">
          <ModalInitiator
            initiatorStyle={
              <div className="flex h-full items-center justify-center gap-0.5 rounded-b-lg bg-gray py-1.5 pl-3 pr-2 text-white xs:rounded-l-lg xs:rounded-r-none">
                <p>{t(validSearchCategory.category)}</p>
                <MdKeyboardArrowDown className="mt-0.5 text-xl" />
              </div>
            }
          >
            <div className="flex flex-col gap-1 whitespace-nowrap text-md">
              <h1 className="mb-1 text-sm">{t("search categories:")}</h1>
              {SearchCategoriesArray.map((searchCategory) => (
                <button
                  key={searchCategory}
                  disabled={validSearchCategory.category === searchCategory}
                  className={clsx(
                    "py-1 text-left",
                    validSearchCategory.category === searchCategory &&
                      "text-secondary dark:text-secondary-light"
                  )}
                  onClick={() => changeCategory(searchCategory)}
                >
                  {t(searchCategory)}
                </button>
              ))}
            </div>
          </ModalInitiator>
          <SearchEngine searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
};
