import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const [, locale] = request.nextUrl.pathname.split("/");

  if (!routing.locales.includes(locale)) {
    const usesNewProfile = request.cookies.get("NEXT_LOCALE")?.value;
    const pathname = request.nextUrl.pathname;
    const normalizedPathname = pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;
    const newUrl = (locale: string) => `/${locale}` + normalizedPathname;

    if (usesNewProfile) {
      request.nextUrl.pathname = newUrl(usesNewProfile);
    } else request.nextUrl.pathname = newUrl(routing.defaultLocale);
  }

  const response = handleI18nRouting(request);
  return await updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
