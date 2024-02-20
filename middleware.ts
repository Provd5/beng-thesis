import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "./i18n";

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(request: NextRequest) {
  //supabase auth middleware
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // next-intl localization
  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: true,
  });
  response = handleI18nRouting(request);

  return response;
}

export const config = {
  // all supported languages from locales
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
