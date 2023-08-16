import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import langParser from "accept-language-parser";

import { defaultLocale, locales } from "./i18n";

const findBestMatchingLocale = (acceptLangHeader: string) => {
  const parsedLangs = langParser.parse(acceptLangHeader);

  for (let i = 0; i < parsedLangs.length; i++) {
    const parsedLang = parsedLangs[i];
    const matchedLocale = locales.find((locale) => {
      const localePart = locale.toLowerCase();
      return parsedLang.code === localePart;
    });
    if (matchedLocale) {
      return matchedLocale;
    }
  }
  return defaultLocale;
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  //supabase auth middleware
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // localization
  const { pathname } = req.nextUrl;
  const localeFromPathname = pathname.split("/")[1];
  const langCookie = req.cookies.get("lang");

  const pathnameIsMissingValidLocale = locales.every((locale) => {
    const localePart = locale.toLowerCase();
    return !pathname.startsWith(`/${localePart}`);
  });

  if (pathnameIsMissingValidLocale) {
    if (langCookie && locales.includes(langCookie.value)) {
      const res = NextResponse.redirect(
        new URL(`/${langCookie.value}${pathname}`, req.url)
      );
      return res;
    } else {
      const matchedLocale = findBestMatchingLocale(
        req.headers.get("Accept-Language") || defaultLocale
      );

      const matchedLocalePart = matchedLocale.toLowerCase();
      const res = NextResponse.redirect(
        new URL(`/${matchedLocalePart}${pathname}`, req.url)
      );
      res.cookies.set("lang", matchedLocalePart);
      return res;
    }
  } else if (
    langCookie &&
    !pathname.startsWith(`/${langCookie.value}`) &&
    locales.includes(localeFromPathname)
  ) {
    res.cookies.set("lang", localeFromPathname);
  }

  // color theme initialization
  if (req.headers.get("Accept")?.includes("text/html")) {
    res.headers.set(
      "Accept-CH",
      `Sec-CH-Prefers-Color-Scheme, Sec-CH-Prefers-Contrast`
    );
    res.headers.set("Vary", "Sec-CH-Prefers-Color-Scheme");
    res.headers.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
