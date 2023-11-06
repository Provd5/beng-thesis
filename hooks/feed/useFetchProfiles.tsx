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

export type FetchProfilesProps = CommonProps & {
  variant: "following" | "followers" | undefined;
  userId: string | undefined;
  sessionId: string | undefined;
};

export function useFetchProfiles({
  userId,
  sessionId,
  variant,
  takeLimit,
  orderBy,
  order,
}: FetchProfilesProps) {
  const te = useTranslations("Errors");

  const isInitialRender = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [fetchedData, setFetchedData] = useState<ProfileCardDataInterface[]>(
    []
  );

  const fetchMore = async () => {
    setIsLoading(true);

    const userIdParam = userId ? `&userId=${userId}` : "";
    const sessionIdParam = sessionId ? `&sessionId=${sessionId}` : "";
    const variantParam = variant ? `&variant=${variant}` : "";
    const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
    const orderParam = order ? `&order=${order}` : `&order=desc`;

    const query =
      `/api/feed/profiles?takeLimit=${takeLimit}&page=${pageNumber}` +
      userIdParam +
      sessionIdParam +
      variantParam +
      orderByParam +
      orderParam;

    await axios
      .get(query)
      .then(({ data }: { data: ProfileCardDataInterface[] }) => {
        setFetchedData((prevData) => [...prevData, ...data]);
        setPageNumber((prev) => prev + 1);
      })
      .catch(() =>
        toast.error(te(GlobalErrors.COULD_NOT_FETCH, { item: "profiles" }))
      )
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

  return { fetchedData, isLoading, fetchMore, pageNumber };
}
