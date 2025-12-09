import ProductDetail from "@/app/[locale]/product/components/ProductDetail";
import { Metadata } from "next";
import { headers } from "next/headers";
import {
  ResultWrapper,
  ShortProductOptionDetailDto,
} from "@/models/product.model";
import { filterProductOptions } from "@/api/products";
import { notFound } from "next/navigation"; // HIGHLIGHT: Import notFound

// Define proper types for the function parameters
type PageParams = {
  locale: string;
  s: string;
};

type SearchParams = {
  id?: string;
  s?: string;
  variant?: string;
  [key: string]: string | string[] | undefined;
};

function slugifyDomain(url: string): string {
  let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");
  return host.replace(/[^a-zA-Z0-9]/g, "");
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  try {
    let productSlug: string = params.s || "";
    const productId = parseInt(searchParams.id || "", 10) || 0;
    if (!productId && !productSlug) return { title: "Product Not Found" };

    const headersList = headers();
    const host =
      headersList.get("x-forwarded-host") || headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "https";
    let imageDomain = slugifyDomain(host);
    imageDomain = imageDomain.includes("localhost")
      ? "letrafutarhu"
      : imageDomain;
    const domain = `${protocol}://${host}`;

    const variants =
      searchParams.variant
        ?.split(",")
        .map(Number)
        .filter((num: number) => !isNaN(num)) || [];

    const filter = {
      visibility: true,
      productId,
      productSlug,
      perPage: 1,
      variants,
    };
    const result: ResultWrapper = await filterProductOptions(filter);
    const product: ShortProductOptionDetailDto | undefined = result?.product;

    if (!product) return { title: "Product Not Found" };

    if (product) {
      productSlug = product.productSlug;
    }

    const canonicalUrl = `${domain}/product/${productSlug}`;

    const root = `${imageDomain}.s3.eu-west-1.amazonaws.com/`;

    const cleanDescription = product.shortDescription
      ? product.shortDescription.replace(/<[^>]*>?/gm, "").substring(0, 160)
      : "Product description";

    return {
      title: product.name,
      description: cleanDescription,
      keywords: product.seoKeywords || "",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: product.name,
        description: cleanDescription,
        images:
          product.images && product.images.length > 0
            ? [`https://${root}products/${product.images[0].image}`]
            : [],
        type: "website",
        url: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product",
      description: "Product details",
    };
  }
}

// HIGHLIGHT-START
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  // We must fetch the product here to check for its existence
  // before rendering the page.
  let product: ShortProductOptionDetailDto | undefined;
  let productSlug: string = params.s || "";
  const productId = parseInt(searchParams.id || "", 10) || 0;

  // If no identifiers, not found
  if (!productId && !productSlug) {
    notFound();
  }

  const variants =
    searchParams.variant
      ?.split(",")
      .map(Number)
      .filter((num: number) => !isNaN(num)) || [];

  const filter = {
    visibility: true,
    productId,
    productSlug,
    perPage: 1,
    variants,
  };

  try {
    const result: ResultWrapper = await filterProductOptions(filter);
    product = result?.product;
  } catch (error) {
    console.error("Error fetching product in Page:", error);
    // If the API call fails, we can also trigger a not found
    notFound();
  }

  // If the fetch completes but no product is returned, trigger not found
  if (!product) {
    notFound();
  }

  // If product is found, pass its *correct* slug to the detail component
  return <ProductDetail s={product.productSlug} />;
}
// HIGHLIGHT-END