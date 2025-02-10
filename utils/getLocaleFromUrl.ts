import { locales, type localeTypes } from "~/i18n/routing";

export const getLocaleFromUrl = (url: string): localeTypes | undefined => {
  const urlParts = url.split("/");
  const localeFromUrl = urlParts[1];

  const validLocale = locales.includes(localeFromUrl)
    ? (localeFromUrl as localeTypes)
    : undefined;

  return validLocale;
};
