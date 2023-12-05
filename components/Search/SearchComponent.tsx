"use client";

import { type FC, useRef } from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";

import { BiSearchAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";

import { SearchErrors } from "~/lib/validations/errorsEnums";

import { ModalInitiator } from "../Modals/ModalInitiator";
import { Input } from "../ui/Input";

type searchCategories = "books" | "profiles";

interface SearchComponentProps {
  searchParams:
    | {
        q?: string;
        category?: searchCategories;
      }
    | undefined;
}

export const SearchComponent: FC<SearchComponentProps> = ({ searchParams }) => {
  const t = useTranslations("Search");
  const te = useTranslations("Errors");

  const searchCategoriesArray: searchCategories[] = ["books", "profiles"];
  const defaultCategory = searchParams?.category
    ? searchParams.category
    : "books";

  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback(() => {
    const inputValue = inputRef.current?.value;
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (inputValue) {
      if (inputValue.length < 2) {
        toast.error(te(SearchErrors.SEARCH_TEXT_TOO_SHORT_2));
        return;
      }
      params.set("q", inputValue);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const changeCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    params.delete("q");
    params.set("page", "1");
    params.set("category", category);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="w-full rounded-t-3xl border-b border-white-light bg-white dark:border-black-dark dark:bg-black md:rounded-none">
        <div className="container flex h-full w-full items-center justify-center px-8 py-3">
          <div className="flex w-full flex-col-reverse xs:flex-row xs:justify-end">
            <ModalInitiator
              initiatorStyle={
                <div className="flex h-full items-center justify-center gap-0.5 rounded-b-lg bg-gray py-1.5 pl-3 pr-2 text-white xs:rounded-l-lg xs:rounded-r-none">
                  <p>{t(defaultCategory)}</p>
                  <MdKeyboardArrowDown className="mt-0.5 text-xl" />
                </div>
              }
            >
              <div className="flex flex-col gap-1 whitespace-nowrap text-md">
                <h1 className="mb-1 text-sm">{t("search categories:")}</h1>
                {searchCategoriesArray.map((category) => (
                  <button
                    disabled={defaultCategory === category}
                    className={clsx(
                      "py-1 text-left",
                      defaultCategory === category &&
                        "text-secondary dark:text-secondary-light"
                    )}
                    key={category}
                    onClick={() => changeCategory(category)}
                  >
                    {t(category)}
                  </button>
                ))}
              </div>
            </ModalInitiator>
            <form
              role="search"
              className="flex w-full sm:w-auto"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Input
                className="h-full w-full rounded-none rounded-tl-lg xs:rounded-tl-none sm:w-80"
                ref={inputRef}
                id="search-input"
                name="q"
                type="search"
                inverted
                min={2}
                defaultValue={searchParams?.q ? searchParams.q : ""}
                placeholder={
                  defaultCategory === "profiles"
                    ? t("enter username")
                    : t("enter title/isbn")
                }
                onChange={handleSearch}
                loading={false}
              />

              <button
                type="submit"
                className="flex w-11 shrink-0 items-center justify-center rounded-r-lg bg-primary-light dark:bg-secondary"
              >
                <BiSearchAlt className="h-6 w-6 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
