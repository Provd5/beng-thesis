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
  const page = searchParams.get("page");
  const parsedPage = page ? parseInt(page) : 0;
  const validPage = parsedPage > 1 ? parsedPage : 1;

  const orderBy = searchParams.get("orderBy") || "";
  const filteredOrderByArray = sortArray.find(
    (sort) => sort.orderBy === orderBy
  );

  const validOrderBy = filteredOrderByArray
    ? filteredOrderByArray.orderBy
    : sortArray[0].orderBy;

  const order = searchParams.get("order") || "";
  const filteredOrder = orderArray.find((sort) => sort === order);
  const validOrder = filteredOrder
    ? filteredOrder
    : filteredOrderByArray?.reverseOrder
    ? "asc"
    : "desc";

  return {
    page: validPage,
    order: validOrder,
    orderBy: validOrderBy,
  };
};
