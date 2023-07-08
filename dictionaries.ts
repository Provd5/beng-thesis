export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en";

export const getLocale = ({ locale }: { locale: string }) => {
  const localeParts = locale.toLowerCase();
  return {
    lang: localeParts,
  };
};

const dictionaries = {
  en: () => import("./lang/en.json").then((module) => module.default),
  pl: () => import("./lang/pl.json").then((module) => module.default),
};

export const getTranslator = async (locale: Locale) =>
  dictionaries[locale ?? defaultLocale]();
