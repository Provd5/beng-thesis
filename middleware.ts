import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import langParser from "accept-language-parser";

import { defaultLocale, locales, type localeTypes } from "./i18n";

const getLocale = ({ locale }: { locale: string }) => {
  const localeParts = locale.toLowerCase();
  return {
    lang: localeParts,
  };
};

const findBestMatchingLocale = (acceptLangHeader: string) => {
  const parsedLangs = langParser.parse(acceptLangHeader);

  for (let i = 0; i < parsedLangs.length; i++) {
    const parsedLang = parsedLangs[i];
    const matchedLocale = locales.find((locale) => {
      const localeParts = getLocale({ locale });
      return parsedLang.code === localeParts.lang;
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
  const pathname = req.nextUrl.pathname;

  const pathnameIsMissingValidLocale = locales.every((locale) => {
    const localePart = getLocale({ locale });
    return !pathname.startsWith(`/${localePart.lang}`);
  });

  if (pathnameIsMissingValidLocale) {
    const matchedLocale = findBestMatchingLocale(
      req.headers.get("Accept-Language") || defaultLocale
    );

    const langCookie = req.cookies.get("lang");
    const langCookieValue = langCookie?.value as localeTypes;
    if (locales.includes(langCookieValue)) {
      const res = NextResponse.redirect(
        new URL(`/${langCookieValue}${pathname}`, req.url)
      );
      return res;
    }

    const matchedLocalePart = getLocale({ locale: matchedLocale });
    const res = NextResponse.redirect(
      new URL(`/${matchedLocalePart.lang}${pathname}`, req.url)
    );
    res.cookies.set("lang", matchedLocalePart.lang);
    return res;
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
