import { defaultLocale, locales, type localeTypes } from "~/i18n/routing";

export const getLocaleFromUrl = (url: string): localeTypes => {
  const urlParts = url.split("/");
  const localeFromUrl = urlParts[1];

  const validLocale = locales.includes(localeFromUrl as localeTypes)
    ? (localeFromUrl as localeTypes)
    : defaultLocale;

  return validLocale;
};
