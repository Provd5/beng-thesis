import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  messages: (await import(`./lang/${locale}.json`)).default,
}));

export const locales: localeTypes[] = ["en", "pl"];
export type localeTypes = "en" | "pl";
export const defaultLocale = "en";
