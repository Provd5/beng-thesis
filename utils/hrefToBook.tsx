import Cookies from "js-cookie";

export const hrefToBook = (
  bookId: string,
  bookTitle: string,
  currentPathname: string
) => {
  const lang = Cookies.get("lang");

  return {
    pathname: `${lang ? `/${lang}` : ""}/book/${bookId}/${bookTitle}/`,
    query: { from: currentPathname },
  };
};
