import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import langParser from "accept-language-parser";

import { defaultLocale, getLocaleFrom, locales } from "./dictionaries";

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  //supabase auth middleware
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // localization
  const findBestMatchingLocale = (acceptLangHeader: string) => {
    const parsedLangs = langParser.parse(acceptLangHeader);

    for (let i = 0; i < parsedLangs.length; i++) {
      const parsedLang = parsedLangs[i];
      const matchedLocale = locales.find((locale) => {
        const localeParts = getLocaleFrom({ locale });
        return parsedLang.code === localeParts.lang;
      });
      if (matchedLocale) {
        return matchedLocale;
      }
    }
    return defaultLocale;
  };

  const pathname = req.nextUrl.pathname;
  const defaultLocalePart = getLocaleFrom({ locale: defaultLocale });
  const currentPathnamePart = getLocaleFrom({ pathname });
  if (currentPathnamePart.lang === defaultLocalePart.lang) {
    return NextResponse.redirect(
      new URL(
        pathname.replace(
          `/${defaultLocalePart.lang}`,
          pathname.startsWith("/") ? "/" : ""
        ),
        req.url
      )
    );
  }

  const pathnameIsMissingValidLocale = locales.every((locale) => {
    const localePart = getLocaleFrom({ locale });
    return !pathname.startsWith(`/${localePart.lang}`);
  });

  if (pathnameIsMissingValidLocale) {
    const matchedLocale = findBestMatchingLocale(
      req.headers.get("Accept-Language") || defaultLocale
    );

    if (matchedLocale !== defaultLocale) {
      const matchedLocalePart = getLocaleFrom({ locale: matchedLocale });
      return NextResponse.redirect(
        new URL(`/${matchedLocalePart.lang}${pathname}`, req.url)
      );
    } else {
      return NextResponse.rewrite(
        new URL(`/${defaultLocalePart.lang}${pathname}`, req.url)
      );
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
