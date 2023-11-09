"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

import { GlobalErrors } from "../../lib/validations/errorsEnums";

interface CommonProps {
  takeLimit: number;
  orderBy?: string;
  order?: "desc" | "asc";
}

export type useFetchSearchProps = CommonProps & {
  searchText: string;
  searchCategory: "title" | "authors" | "isbn" | undefined;
  sessionId: string | undefined;
};

export function useFetchSearch({
  searchText,
  searchCategory,
  sessionId,
  takeLimit,
  orderBy,
  order,
}: useFetchSearchProps) {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchedData, setFetchedData] = useState<SearchBooksInterface["book"]>(
    []
  );
  const [itemsFound, setItemsFound] =
    useState<SearchBooksInterface["itemsFound"]>();

  const fetchMore = async () => {
    setIsLoading(true);

    const sessionIdParam = sessionId ? `&sessionId=${sessionId}` : "";
    const searchCategoryParam = searchCategory
      ? `&searchCategory=${searchCategory}`
      : "";
    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

    const query =
      `/api/feed/search/books?takeLimit=${takeLimit}&page=${pageNumber}&searchText=${searchText}` +
      sessionIdParam +
      searchCategoryParam +
      orderByParam +
      orderParam;

    await axios
      .get(query)
      .then(({ data }: { data: SearchBooksInterface }) => {
        setFetchedData((prevData) => [...prevData, ...data.book]);
        setItemsFound(data.itemsFound);
        setPageNumber((prev) => prev + 1);
      })
      .catch(() => toast.error(te(GlobalErrors.COULD_NOT_FETCH)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    setFetchedData([]);
    setPageNumber(1);
  }, [order, orderBy]);

  useEffect(() => {
    if (fetchedData.length === 0 && pageNumber === 1) {
      void fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData, pageNumber]);

  return { fetchedData, itemsFound, isLoading, fetchMore, pageNumber };
}
