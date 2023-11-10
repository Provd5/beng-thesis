"use client";

import { type FC, type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";
import clsx from "clsx";

import { BiSearchAlt } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";

import { GlobalErrors, SearchErrors } from "~/lib/validations/errorsEnums";

import { BookCard } from "../Explore/BookCard";
import { ProfileCard } from "../Explore/ProfileCard";
import { ModalInitiator } from "../Modals/ModalInitiator";
import { Input } from "../ui/Input";
import { Loader } from "../ui/Loaders/Loader";
import { BookCardLoader } from "../ui/Loaders/Skeletons/BookCardLoader";
import { ProfileCardLoader } from "../ui/Loaders/Skeletons/ProfileCardLoader";
import { NotFoundItems } from "../ui/NotFoundItems";

interface SearchComponentProps {
  sessionId: string | undefined;
}

type searchCategoryType = "books" | "users";

export const SearchComponent: FC<SearchComponentProps> = ({ sessionId }) => {
  const t = useTranslations("Search");
  const te = useTranslations("Errors");

  const searchCategories: searchCategoryType[] = ["books", "users"];
  const [searchCategory, setSearchCategory] = useState<searchCategoryType>(
    searchCategories[0]
  );

  const [isLoading, setIsLoading] = useState(false);

  const [itemsFound, setItemsFound] = useState<number | null>(null);
  const [fetchedData, setFetchedData] = useState<
    (ProfileCardDataInterface | BookInterface)[]
  >([]);

  const changeCategory = (category: searchCategoryType) => {
    setSearchCategory(category);
    setItemsFound(null);
    setFetchedData([]);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setItemsFound(null);
    setFetchedData([]);

    try {
      const form = event.currentTarget as HTMLFormElement;
      const search = form.elements.namedItem("q") as HTMLInputElement;

      const sessionIdParam = sessionId ? `&sessionId=${sessionId}` : "";
      const searchText = search.value;

      if (searchText.length < 3) {
        toast.error(te(SearchErrors.SEARCH_TEXT_TOO_SHORT_3));
        return;
      }

      const query =
        `/api/feed/search?searchCategory=${searchCategory}&searchText=${searchText}` +
        sessionIdParam;

      await axios
        .get(query)
        .then(
          ({
            data,
          }: {
            data: SearchBooksInterface | SearchProfilesInterface;
          }) => {
            const narrowedData = "profile" in data ? data.profile : data.book;

            setFetchedData((prevData) => [...prevData, ...narrowedData]);
            setItemsFound(data.itemsFound);
          }
        );
    } catch (error) {
      toast.error(te(GlobalErrors.COULD_NOT_FETCH, { item: "other" }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full rounded-t-3xl border-b border-white-light bg-white dark:border-black-dark dark:bg-black md:rounded-none">
        <div className="container flex h-full w-full items-center justify-center px-8 py-3">
          <div className="flex w-full flex-col-reverse xs:flex-row xs:justify-end">
            <ModalInitiator
              initiatorStyle={
                <div className="flex h-full items-center justify-center gap-0.5 rounded-b-lg bg-gray py-1.5 pl-3 pr-2 text-white xs:rounded-l-lg xs:rounded-r-none">
                  <p>{t(searchCategory)}</p>
                  <MdKeyboardArrowDown className="mt-0.5 text-xl" />
                </div>
              }
            >
              <div className="flex flex-col gap-1 whitespace-nowrap text-md">
                <h1 className="mb-1 text-sm">{t("search categories:")}</h1>
                {searchCategories.map((category) => (
                  <button
                    className={clsx(
                      "py-1 text-left",
                      searchCategory === category &&
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
              onSubmit={handleSearch}
            >
              <Input
                id="search-input"
                name="q"
                type="search"
                required
                minLength={3}
                loading={isLoading}
                className="h-full w-full rounded-none rounded-tl-lg xs:rounded-tl-none sm:w-80"
                inverted
                placeholder={
                  searchCategory === "books"
                    ? t("enter title/isbn")
                    : t("enter username")
                }
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
      <div className="container py-6">
        {itemsFound !== null ? (
          <h1 className="mb-3 flex items-center gap-1">
            <span className="py-0.5">{t("items found:")}</span>
            <span className="text-secondary dark:text-secondary-light">
              {isLoading ? <Loader /> : itemsFound}
            </span>
          </h1>
        ) : (
          <div className="mb-3 h-5 py-0.5" />
        )}
        {isLoading ? (
          searchCategory === "books" ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <BookCardLoader key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ProfileCardLoader key={i} />
              ))}
            </div>
          )
        ) : itemsFound !== null ? (
          itemsFound > 0 ? (
            <>
              {searchCategory === "books" ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {(fetchedData as BookInterface[]).map((data) => (
                    <BookCard key={data.id} bookData={data} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    (fetchedData && fetchedData) as ProfileCardDataInterface[]
                  ).map((data) => (
                    <ProfileCard
                      key={data.id}
                      profileData={data}
                      sessionId={sessionId}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <NotFoundItems />
          )
        ) : (
          <div className="flex flex-col justify-center gap-3 p-6 text-center text-md text-gray">
            {t("what are you searching for?")}{" "}
            <span className="text-xl">👀</span>
          </div>
        )}
      </div>
    </>
  );
};
