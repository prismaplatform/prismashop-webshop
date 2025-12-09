import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  // Check for existing locale cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  let locale: string;

  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    // Use cookie locale if it exists and is supported
    locale = cookieLocale;
  } else {
    // Get user's preferred languages from Accept-Language header
    const acceptLanguage = request.headers.get("accept-language") || "";
    const userLocales = acceptLanguage.split(",").map((lang) => lang.split(";")[0].split("-")[0]);

    // Find first matching locale or use default
    locale =
      userLocales.find((loc) => routing.locales.includes(loc as any)) || routing.defaultLocale;
  }

  // Create the next-intl middleware
  const intlMiddleware = createMiddleware(routing);

  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already includes a locale
  const hasLocale = routing.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // Create response (either redirect or pass to intlMiddleware)
  let response: NextResponse;

  if (!hasLocale && (pathname === "/" || pathname === "")) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    response = NextResponse.redirect(newUrl);
  } else {
    response = intlMiddleware(request);
  }

  // Set locale cookie if it doesn't exist or is different
  if (!cookieLocale || cookieLocale !== locale) {
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "strict",
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/((?!_next|_vercel|public|api|.*\\..*).*)"],
};
