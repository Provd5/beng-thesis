import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export type localeTypes = "en" | "pl";
export const locales = ["en", "pl"];
export const defaultLocale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
