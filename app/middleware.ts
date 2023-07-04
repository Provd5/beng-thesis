import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import Negotiator from "negotiator";

const locales = ["en", "pl"];
const defaultLocale = "en";

function getLocale(req: NextRequest): string {
  const headers = new Headers(req.headers);
  const acceptLanguage = headers.get("accept-language");
  acceptLanguage &&
    headers.set("accept-language", acceptLanguage.replaceAll("_", "-"));
  const headersObject = Object.fromEntries(headers.entries());

  const languages = new Negotiator({ headers: headersObject }).languages();
  return match(languages, locales, defaultLocale);
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  //supabase auth middleware
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  // localization
  const pathname = req.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req) ?? defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
