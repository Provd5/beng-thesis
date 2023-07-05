export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en";

type PathnameLocale = {
  pathname: string;
  locale?: never;
};
type ISOLocale = {
  pathname?: never;
  locale: string;
};

type LocaleSource = PathnameLocale | ISOLocale;

export const getLocaleFrom = ({ pathname, locale }: LocaleSource) => {
  if (locale) {
    const localeParts = locale.toLowerCase();
    return {
      lang: localeParts,
    };
  } else {
    const pathnameParts = pathname!.toLowerCase().split("/");
    return {
      lang: pathnameParts[1],
    };
  }
};

const dictionaries = {
  en: () => import("./lang/en.json").then((module) => module.default),
  pl: () => import("./lang/pl.json").then((module) => module.default),
};

export const getTranslator = async (locale: Locale) => dictionaries[locale]();
