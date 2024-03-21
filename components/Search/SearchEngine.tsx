"use client";

import { type FC, useRef } from "react";
import toast from "react-hot-toast";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";

import { BiSearchAlt } from "react-icons/bi";

import { SearchErrors } from "~/lib/validations/errorsEnums";
import { searchCategoryValidator } from "~/utils/searchCategoryValidator";

import { Input } from "../ui/Input";

interface SearchEngineProps {
  searchParams: ReadonlyURLSearchParams;
}

export const SearchEngine: FC<SearchEngineProps> = ({ searchParams }) => {
  const t = useTranslations("Search");
  const te = useTranslations("Errors");

  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const validSearchCategory = searchCategoryValidator(searchParams);

  const handleSearch = useDebouncedCallback(() => {
    const inputValue = inputRef.current?.value;
    const params = new URLSearchParams(searchParams);

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

  return (
    <form
      role="search"
      className="flex w-full sm:w-auto"
      onSubmit={handleSearch}
    >
      <Input
        className="h-full w-full rounded-none rounded-tl-lg xs:rounded-tl-none sm:w-80"
        id="search-input"
        name="q"
        type="search"
        inverted
        min={2}
        defaultValue={validSearchCategory.q}
        placeholder={
          validSearchCategory.category === "profiles"
            ? t("enter username")
            : t("enter title/isbn")
        }
        onChange={handleSearch}
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
