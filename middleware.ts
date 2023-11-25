import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

import { defaultLocale, locales } from "./i18n";

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  //supabase auth middleware
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // next-intl localization
  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: true,
  });
  res = handleI18nRouting(req);

  return res;
}

export const config = {
  // all supported languages from locales
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
