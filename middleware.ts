import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

import { defaultLocale, locales } from "./i18n";
import ROUTES from "./utils/routes";

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(request: NextRequest) {
  //supabase auth middleware
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // next-intl localization
  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localeDetection: true,
  });
  response = handleI18nRouting(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const nextUrl = request.nextUrl;
  const protectedRoute = nextUrl.pathname.split("/")[2];

  if (
    !session?.user &&
    (protectedRoute === "profile" || protectedRoute === "edit-profile")
  )
    return Response.redirect(new URL(ROUTES.auth.login, nextUrl));
  if (
    !!session?.user &&
    (protectedRoute === "login" || protectedRoute === "signup")
  )
    return Response.redirect(new URL(ROUTES.profile.session_profile, nextUrl));

  return response;
}

export const config = {
  // all supported languages from locales
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
