export const totalPages = (allItems: number, itemsPerPage: number) =>
  Math.ceil(allItems / itemsPerPage);
