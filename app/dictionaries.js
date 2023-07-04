import "server-only";

const dictionaries = {
  en: () => import("./lang/en.json").then((module) => module.default),
  pl: () => import("./lang/pl.json").then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
