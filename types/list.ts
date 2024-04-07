export interface GetDataList<T> {
  page: number;
  totalPages: number;
  allItems: number;
  itemsPerPage: number;
  data: T[];
}

export interface ListSearchParamsInterface<T> {
  page: number;
  order: "desc" | "asc";
  orderBy: T;
}
