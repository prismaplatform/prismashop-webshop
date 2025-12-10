import React from "react";
import { cookies } from "next/headers";
import { Poppins } from "next/font/google";
import "../globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/ui/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { compileString } from "sass";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Providers from "@/lib/Providers";
import { getConfigurationUrlWithDomain } from "@/utils/configurationHelper";
import { MarketingIdDto } from "@/models/marketing-ids.model";
import GtmProvider from "@/components/app/gtm-provider";
import GtmInit from "@/components/app/gtm-init";
import HeaderLogged from "../../components/ui/Header/HeaderLogged";
import dynamic from "next/dynamic";
import Banner from "@/components/ui/Banner/Banner";
import { redirect } from "next/navigation";
import { getLanguages } from "@/api/languages";
import { getCurrencyByCode } from "@/api/currency";
import { CurrencyProvider } from "@/components/app/CurrencyProvider";
import InitCurrencyCookie from "@/components/app/InitCurrencyCookie";
import { BarionPixelIdDto } from "@/models/barion-pixel-id.model";
import Script from "next/script";
import { DomainProvider } from "@/components/app/DomainProvider";
import AccessibilityWidget from "@/components/layout/AccessibilityWidget";

import {getServerDomain, getServerDomainSlugified} from "@/utils/host-resolver.server";
import { domainConfigs, GLOBAL_DEFAULT_LOCALE } from "@/data/domain-config";

const DynamicNewsletterModal = dynamic(
  () => import("@/components/ui/Modal/NewsletterModal"),
  { ssr: false, loading: () => null },
);

const PixelTracker = dynamic(() => import("@/components/app/PixelTracker"), {
  ssr: false,
});

type Language = { id: number; language: string; slug: string };

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const domain = getServerDomain();
  const slugifiedDomain = getServerDomainSlugified();

  const cookieStore = cookies();

  async function getCompiledScss(slugifiedDomain: string) {
    if (!slugifiedDomain) return "";
    const styleConfigUrl = getConfigurationUrlWithDomain(slugifiedDomain) + "theme.scss";
    try {
      const response = await fetch(styleConfigUrl, {
        next: { revalidate: 3600 },
      });
      if (!response.ok) return ""; // Fail silently, use default CSS
      const scssText = await response.text();
      return compileString(scssText).css;
    } catch (error) {
      console.error(`SCSS Load Error for ${slugifiedDomain}:`, error);
      return "";
    }
  }

  async function getBarionPixelId(slugifiedDomain: string): Promise<BarionPixelIdDto> {
    if (!slugifiedDomain) return { barionPixelId: "" };
    const barionUrl = getConfigurationUrlWithDomain(slugifiedDomain) + "barion.json";
    try {
      const response = await fetch(barionUrl, { next: { revalidate: 3600 } });
      if (!response.ok) return { barionPixelId: "" };
      return await response.json();
    } catch (error) {
      return { barionPixelId: "" };
    }
  }

  async function getMarketingTags(slugifiedDomain: string): Promise<MarketingIdDto> {
    if (!slugifiedDomain)
      return {
        googleTagManagerId: "",
        metaPixelId: "",
        microsoftClarityId: "",
      };
    const marketingConfigUrl =
      getConfigurationUrlWithDomain(slugifiedDomain) + "marketing.json";
    try {
      const response = await fetch(marketingConfigUrl, {
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        console.warn(`Marketing JSON missing for ${slugifiedDomain}`);
        return {
          googleTagManagerId: "",
          metaPixelId: "",
          microsoftClarityId: "",
        };
      }
      return await response.json();
    } catch (error) {
      console.error(`Marketing Load Error for ${slugifiedDomain}:`, error);
      return {
        googleTagManagerId: "",
        metaPixelId: "",
        microsoftClarityId: "",
      };
    }
  }

  const availableLanguages = await getLanguages();
  const supportedLocales = availableLanguages.map(
    (lang: Language) => lang.slug,
  );

    if (!supportedLocales.includes(locale)) {
        const configDefault = domainConfigs[slugifiedDomain]?.defaultLocale;
        let targetLocale = "";
        if (configDefault && supportedLocales.includes(configDefault)) {
            targetLocale = configDefault;
        } else {
            targetLocale = supportedLocales[0] || GLOBAL_DEFAULT_LOCALE;
        }
        if (targetLocale) {
            redirect(`/${targetLocale}`);
        }
    }

  const [compiledCss, marketingIds, barionIds, messages] = await Promise.all([
    getCompiledScss(slugifiedDomain),
    getMarketingTags(slugifiedDomain),
    getBarionPixelId(slugifiedDomain),
    getMessages(),
  ]);

  let currency;
  const currencyCookie = cookieStore.get("currency");
  if (currencyCookie?.value) {
    try {
      currency = JSON.parse(currencyCookie.value);
    } catch (error) {
      currency = getCurrencyByCode("RON")!;
    }
  } else {
    currency = getCurrencyByCode("RON")!;
  }

  return (
    <html lang={locale} className={poppins.className}>
      <head>
        <link
          rel="icon"
          href={`https://daxxgn860i5ze.cloudfront.net/${slugifiedDomain}/favicon.ico`}
        />

        {compiledCss && (
          <style dangerouslySetInnerHTML={{ __html: compiledCss }} />
        )}

        <GtmInit id={marketingIds.googleTagManagerId} />

        {marketingIds.microsoftClarityId && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${marketingIds.microsoftClarityId}");
              `,
            }}
          />
        )}
        {barionIds.barionPixelId && (
          <>
            <Script id="barion-pixel-init" strategy="afterInteractive">
              {`
          window["bp"] = window["bp"] || function () {
            (window["bp"].q = window["bp"].q || []).push(arguments);
          };
          window["bp"].l = 1 * new Date();
          bp('init', 'addBarionPixelId', '${barionIds.barionPixelId}');
        `}
            </Script>
            <Script
              id="barion-pixel-script"
              src="https://pixel.barion.com/bp.js"
              strategy="afterInteractive"
            />
          </>
        )}
      </head>
      <body className="bg-menu-bg-light text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${marketingIds.googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <PixelTracker id={marketingIds.metaPixelId} />

        {barionIds.barionPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt="Barion Pixel"
              src={`https://pixel.barion.com/a.gif?ba_pixel_id=${barionIds.barionPixelId}&ev=contentView&noscript=1`}
            />
          </noscript>
        )}

        <Providers>
          <DomainProvider domain={slugifiedDomain}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <CurrencyProvider value={currency}>
                <InitCurrencyCookie />
                <Banner />
                <HeaderLogged domain={slugifiedDomain} />
                {children}
                <GtmProvider id={marketingIds.googleTagManagerId} />
                <Footer domain={slugifiedDomain} />
                <Toaster position="top-right" />
              </CurrencyProvider>
            </NextIntlClientProvider>
          </DomainProvider>
        </Providers>
        <AccessibilityWidget />
      </body>
    </html>
  );
}