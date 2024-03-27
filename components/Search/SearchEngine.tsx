"use client";

import { type FC, type TransitionStartFunction, useRef } from "react";
import toast from "react-hot-toast";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import {
  type Formats,
  type TranslationValues,
  useTranslations,
} from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { BiSearchAlt } from "react-icons/bi";

import { ErrorsToTranslate } from "~/lib/validations/errorsEnums";
import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { Input } from "../ui/Input";

interface SearchEngineProps {
  startTransition: TransitionStartFunction;
  searchParams: ReadonlyURLSearchParams;
}

export const SearchEngine: FC<SearchEngineProps> = ({
  startTransition,
  searchParams,
}) => {
  const t = useTranslations("Search");
  const te = useTranslations("Errors") as (
    key: string,
    values?: TranslationValues | undefined,
    formats?: Partial<Formats> | undefined
  ) => string;

  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const validSearchCategory = searchCategoryValidator(searchParams);

  const handleSearch = useDebouncedCallback(() => {
    const inputValue = inputRef.current?.value;
    const params = new URLSearchParams(searchParams);

    if (inputValue) {
      if (inputValue.length < 2) {
        toast.error(te(ErrorsToTranslate.SEARCH.SEARCH_IS_TOO_SHORT));
        return;
      }

      params.set("q", inputValue);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }
  }, 300);

  return (
    <form
      role="search"
      className="flex w-full sm:w-auto"
      onSubmit={(e) => (e.preventDefault(), handleSearch())}
    >
      <Input
        ref={inputRef}
        className="h-full w-full rounded-none rounded-tl-lg xs:rounded-tl-none sm:w-80"
        id="search-input"
        name="q"
        type="search"
        inverted
        min={2}
        defaultValue={validSearchCategory.q || ""}
        placeholder={
          validSearchCategory.category === "profiles"
            ? t("enter username")
            : t("enter title/isbn")
        }
        onChange={() => handleSearch()}
      />

      <button
        type="submit"
        className="flex w-11 shrink-0 items-center justify-center rounded-r-lg bg-primary-light dark:bg-secondary"
      >
        <BiSearchAlt className="h-6 w-6 text-white" />
      </button>
    </form>
  );
};
