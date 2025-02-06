"use client";

import React, { type FC, useRef, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { MdKeyboardArrowDown } from "react-icons/md";

import { SearchCategoriesArray } from "~/types/search";

import { cn } from "~/utils/cn";
import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { LargeComponentLoader } from "../ui/Loaders/Loader";
import { SearchEngine } from "./SearchEngine";

interface SearchComponentProps {
  searchParams: unknown;
  children: React.ReactNode;
}

export const SearchComponent: FC<SearchComponentProps> = ({
  searchParams,
  children,
}) => {
  const t = useTranslations("Search");

  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const validSearchCategory = searchCategoryValidator(searchParams);

  const [isPending, startTransition] = useTransition();

  const changeCategory = (searchCategory: string) => {
    const params = new URLSearchParams(validSearchCategory);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    params.set("q", "");
    params.set("category", searchCategory);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <>
      <div className="w-full border-b border-colors-accent bg-white dark:bg-black max-md:rounded-t-3xl">
        <div className="container flex size-full items-center justify-center px-8 py-3">
          <div className="flex w-full flex-col-reverse">
            <ModalInitiator
              initiatorStyle={
                <div className="flex h-full origin-top-left items-center justify-center gap-0.5 rounded-b-lg bg-colors-primary py-1.5 pl-3 pr-2 text-white transition-transform hover:scale-105">
                  <p>{t(validSearchCategory.category)}</p>
                  <MdKeyboardArrowDown className="mt-0.5 text-xl" />
                </div>
              }
            >
              <div className="text-md flex flex-col gap-1 whitespace-nowrap">
                <h1 className="mb-1 text-sm">{t("search categories:")}</h1>
                {SearchCategoriesArray.map((searchCategory) => (
                  <button
                    key={searchCategory}
                    disabled={validSearchCategory.category === searchCategory}
                    className={cn(
                      "py-1 text-left transition-transform",
                      validSearchCategory.category === searchCategory &&
                        "text-colors-primary",
                      validSearchCategory.category !== searchCategory &&
                        "hover:translate-x-1",
                    )}
                    onClick={() => changeCategory(searchCategory)}
                  >
                    {t(searchCategory)}
                  </button>
                ))}
              </div>
            </ModalInitiator>
            <SearchEngine
              searchParams={searchParams}
              startTransition={startTransition}
            />
          </div>
        </div>
      </div>
      {isPending ? <LargeComponentLoader /> : children}
    </>
  );
};
