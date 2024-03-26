import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export type localeTypes = "en" | "pl";
export const locales = ["en", "pl"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as localeTypes)) notFound();

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    messages: (await import(`./lang/${locale}.json`)).default,
  };
});
