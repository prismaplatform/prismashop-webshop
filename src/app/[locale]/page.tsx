import React from "react";
import SectionPromo1 from "@/components/layout/SectionPromo1/SectionPromo1";
import SectionHero2 from "@/components/layout/SectionHero/SectionHero2";
import SectionPromo2 from "@/components/layout/SectionPromo2/SectionPromo2";
import SectionSliderCategories from "@/components/layout/SectionSliderCategories/SectionSliderCategories";
import SectionPromo3 from "@/components/layout/SectionPromo3/SectionPromo3";
import SectionClientSay from "@/components/layout/SectionClientSay/SectionClientSay";
import NewProductCarousel from "@/components/layout/FeaturedProducts/NewProducts";
import TopProductCarousel from "@/components/layout/FeaturedProducts/TopProducts";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> => {
  const t = await getTranslations("SEO.pages.Home");
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const canonicalUrl = `${protocol}://${host}/${params.locale}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").concat(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: t("title"),
      images: [
        {
          url: t("ogImage"),
          alt: t("ogTitle"),
        },
      ],
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [t("ogImage")],
    },
  };
};

function PageHome() {
  return (
    <div
      className="nc-PageHome relative overflow-hidden bg-menu-bg-light"
    >
      <SectionHero2 />

      {/* <div className="mt-24 lg:mt-32">
        <DiscoverMoreSlider />
      </div> */}

      <div className="container relative space-y-12 lg:space-y-24 my-24">
        <SectionSliderCategories />

        <TopProductCarousel />

        <SectionPromo1 />

        <NewProductCarousel />

        <SectionPromo2 />

        <SectionClientSay />

        <SectionPromo3 />
      </div>
    </div>
  );
}

export default PageHome;
