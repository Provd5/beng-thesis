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

type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

const dictionaries: Record<Locale, () => Promise<TranslationDictionary>> = {
  en: () => import("./lang/en.json").then((module) => module.default),
  pl: () => import("./lang/pl.json").then((module) => module.default),
} as const;

export const getTranslator = async (locale: Locale) => {
  const dictionary = await dictionaries[locale]();
  return (key: string, params?: { [key: string]: string | number }) => {
    let translation: string | undefined = key
      .split(".")
      .reduce((obj: TranslationDictionary | string | undefined, key) => {
        if (typeof obj === "object" && obj !== null && key in obj) {
          return obj[key];
        }
        return undefined;
      }, dictionary) as string | undefined;
    if (!translation) {
      return key;
    }
    if (params && Object.entries(params).length) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation!.replace(`{{ ${key} }}`, String(value));
      });
    }
    return translation;
  };
};
