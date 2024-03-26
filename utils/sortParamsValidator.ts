import { type ReadonlyURLSearchParams } from "next/navigation";

import { type OrderType, type SortsType } from "~/types/sort";

import { orderArray, type SortArrayInterface } from "../types/orderArrays";

export const sortParamsValidator = (
  searchParams: ReadonlyURLSearchParams,
  sortArray: SortArrayInterface<SortsType>[]
): {
  page: number;
  order: OrderType;
  orderBy: SortsType;
} => {
  const urlSearchParams = new URLSearchParams(searchParams);

  const page = urlSearchParams.get("page");
  const parsedPage = page ? parseInt(page) : 0;
  const validPage = parsedPage > 1 ? parsedPage : 1;

  const orderBy = urlSearchParams.get("orderBy");
  const filteredOrderByArray = sortArray.find(
    (sort) => sort.orderBy === orderBy
  );

  const validOrderBy = filteredOrderByArray
    ? filteredOrderByArray
    : sortArray[0];

  const order = urlSearchParams.get("order");
  const filteredOrder = orderArray.find((sort) => sort === order);
  const validOrder = filteredOrder
    ? filteredOrder
    : validOrderBy.reverseOrder
    ? "asc"
    : "desc";

  return {
    page: validPage,
    order: validOrder,
    orderBy: validOrderBy.orderBy,
  };
};
