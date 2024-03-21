import { type ReadonlyURLSearchParams } from "next/navigation";

import { SearchCategoriesArray, type SearchCategoryType } from "~/types/search";

export const searchCategoryValidator = (
  searchParams: ReadonlyURLSearchParams
): { category: SearchCategoryType; q: string } => {
  const query = searchParams.get("q") || "";

  const category = searchParams.get("category") || "";
  const filteredCategory = SearchCategoriesArray.find(
    (sort) => sort === category
  );
  const validCategory = filteredCategory
    ? filteredCategory
    : SearchCategoriesArray[0];

  return { category: validCategory, q: query };
};
