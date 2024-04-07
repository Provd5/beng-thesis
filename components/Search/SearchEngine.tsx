"use client";

import {
  type FC,
  type TransitionStartFunction,
  useEffect,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
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
  searchParams: unknown;
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

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSearch = useDebouncedCallback(() => {
    const inputValue = inputRef.current?.value;
    const params = new URLSearchParams(validSearchCategory);

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
      className="flex w-full max-w-96"
      onSubmit={(e) => (e.preventDefault(), handleSearch())}
    >
      <Input
        ref={inputRef}
        className="rounded-none rounded-tl-lg border-colors-primary/50"
        id="search-input"
        name="q"
        type="search"
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
        className="flex w-11 shrink-0 items-center justify-center rounded-r-lg bg-colors-primary"
      >
        <BiSearchAlt className="size-6 text-white transition-transform hover:scale-110" />
      </button>
    </form>
  );
};
