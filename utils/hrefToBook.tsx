export const hrefToBook = (
  bookId: string,
  bookTitle: string,
  currentPathname: string
) => {
  const pathnameParts = currentPathname?.split("/");
  const localeFromUrl = pathnameParts?.[1];
  const prevLocationWithoutLocale = localeFromUrl
    ? currentPathname?.replace(`/${localeFromUrl}`, "") || ""
    : "";

  return {
    pathname: `/book/${bookId}/${bookTitle}`,
    query: { from: prevLocationWithoutLocale },
  };
};
