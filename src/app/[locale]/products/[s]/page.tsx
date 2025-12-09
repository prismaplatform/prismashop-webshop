import React from "react";
import ProductsAndFilter from "@/app/[locale]/products/components/ProductsAndFilter";
import { getTranslations } from "next-intl/server";
import { filterFilterOptions, filterProductOptions } from "@/api/products";
import { ProductFilterDto } from "@/models/filter.model";
import { headers } from "next/headers";
import { Metadata } from "next";
import { ResultWrapper } from "@/models/product.model";

const getFilterForServer = (
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  params: { locale: string; s: string } | undefined,
): ProductFilterDto => {
  const category = params?.s && params.s!="all"? params.s : undefined;
  const page = Number(searchParams?.page) || 1;
  const term = (searchParams?.term as string) || "";
  const inActionParam = searchParams?.inAction;
  const inAction =
    inActionParam === "true"
      ? true
      : inActionParam === "false"
        ? false
        : undefined;
  const variants =
    (searchParams?.variant as string)
      ?.split(",")
      .map(Number)
      .filter((num) => !isNaN(num)) || [];
  const attributes =
    (searchParams?.attribute as string)
      ?.split(",")
      .map(Number)
      .filter((num) => !isNaN(num)) || [];

  const minPriceParam = searchParams?.min_price;
  const maxPriceParam = searchParams?.max_price;
  let priceRange = undefined;
  if (minPriceParam && maxPriceParam) {
    priceRange = [Number(minPriceParam), Number(maxPriceParam)];
  }

  return {
    visibility: true,
    category,
    brandId: undefined,
    archived: false,
    active: true,
    priceRange,
    page,
    perPage: 36,
    variants,
    attributes,
    name: term,
    inAction,
  };
};

export const generateMetadata = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { locale: string; s: string } | undefined;
}): Promise<Metadata> => {
  const t = await getTranslations("SEO.pages.Home");
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const canonicalParams = new URLSearchParams();
  if (params?.s && params.s != "all") {
    canonicalParams.set("category", params.s as string);
  }
  if (searchParams?.term) {
    canonicalParams.set("term", searchParams.term as string);
  }
  const canonicalQueryString = canonicalParams.toString();
  const canonicalUrl = `${protocol}://${host}/${params?.locale}/products${
    canonicalQueryString ? `?${canonicalQueryString}` : ""
  }`;

  if (params?.s && params.s != "all") {
    try {
      const filter = getFilterForServer(searchParams, params);
      const result: ResultWrapper = await filterProductOptions(filter);
      if (result.category) {
        const cleanDescription =
          result.category.description?.replace(/<[^>]*>?/gm, "") ||
          t("description");

        return {
          title: result.category.name,
          description: cleanDescription,
          alternates: {
            canonical: canonicalUrl,
          },
          openGraph: {
            title: result.category.name,
            description: cleanDescription,
            url: canonicalUrl,
          },
          twitter: {
            title: result.category.name,
            description: cleanDescription,
          },
        };
      }
    } catch (error) {
      console.error("Failed to fetch category for metadata:", error);
    }
  }

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
      images: [{ url: t("ogImage"), alt: t("ogTitle") }],
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

const PageCollection2 = async ({
  searchParams,
  params,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { locale: string; s: string } | undefined;
}) => {
  const filter = getFilterForServer(searchParams, params);
  const [initialProductData, initialFilterOptionsResult] = await Promise.all([
    filterProductOptions(filter),
    filterFilterOptions(filter),
  ]);

  return (
    <ProductsAndFilter
      initialProductData={initialProductData}
      initialFilterOptions={initialFilterOptionsResult.filter}
      s={params?.s}
    />
  );
};

export default PageCollection2;
