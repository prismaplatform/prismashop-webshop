import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { domainConfigs, GLOBAL_DEFAULT_LOCALE } from "@/data/domain-config";

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  let cleanHost = hostname
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(":")[0];
  cleanHost = cleanHost
    .replace(".prismasolutions.ro", "")
    .replace(".prismaweb.ro", "");
  const domainDefault =
    domainConfigs[cleanHost]?.defaultLocale || GLOBAL_DEFAULT_LOCALE;

  if (hostname.includes(".vercel.app")) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  let locale: string;

  if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    locale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const userLocales = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].split("-")[0]);

    locale =
      userLocales.find((loc) => routing.locales.includes(loc as any)) ||
      domainDefault;
  }

  const intlMiddleware = createMiddleware(routing);

  const pathname = request.nextUrl.pathname;

  const hasLocale = routing.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`,
  );

  let response: NextResponse;

  if (!hasLocale && (pathname === "/" || pathname === "")) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    response = NextResponse.redirect(newUrl);
  } else {
    response = intlMiddleware(request);
  }

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
