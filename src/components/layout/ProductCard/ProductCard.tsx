"use client";

import React, { FC, useEffect, useState } from "react";
// import LikeButton from "./LikeButton";
import { ShopProductDto } from "@/models/product.model";
import { ChevronDoubleRightIcon, StarIcon, TagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Prices from "../../ui/Prices/Prices";
import { SimpleVariantValueDto } from "@/models/variant.model";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/components/app/CurrencyProvider";
import notfound from "/public/no-image.png";

export interface ProductCardProps {
  className?: string;
  data: ShopProductDto;
  index: number;
}

const ProductCard: FC<ProductCardProps> = ({ className = "", data, index }) => {
  const {
    id,
    slug,
    name,
    image,
    rating,
    priceInterval,
    discountPriceInterval,
    link,
  } = data;
  const [rootUrl, setRootUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Pages.Products");

  const currency = useCurrency();

  const formatPrice = (value: number): string => {
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  };

  const renderVariants = () => {
    if (!data.variantTypes || !data.variantTypes.length || loading) {
      return <></>;
    } else {
      // Find the first variant type that has at least one value with an image
      const variantTypeWithImages = data.variantTypes.find((variantType) =>
        variantType.values.some((variant) => variant.image),
      );

      // If no variant type with images is found, use the first variant type
      const variantTypeToShow = variantTypeWithImages || data.variantTypes[0];

      if (!variantTypeToShow) return <></>;

      const hasImages = variantTypeToShow.values.some(
        (variant) => variant.image,
      );

      // Limit to showing only the first 3 variants
      const displayedVariants = variantTypeToShow.values.slice(0, 2);
      const hiddenCount = variantTypeToShow.values.length - 2;

      // Create an array with variant IDs to display
      const createVariantUrlParams = (
        currentVariant: SimpleVariantValueDto,
      ) => {
        // Get all variant types except the current one
        const otherVariantTypes = data.variantTypes.filter(
          (vt) => vt.id !== variantTypeToShow.id,
        );

        // For the current variant type, use the selected variant
        // For other variant types, use their first variant value
        const variantIds = [];

        // Add the current variant ID
        variantIds.push(currentVariant.id);

        // Add first variant value IDs from other variant types
        otherVariantTypes.forEach((vt) => {
          if (vt.values && vt.values.length > 0) {
            variantIds.push(vt.values[0].id);
          }
        });

        return variantIds;
      };

      return (
        <div className="space-y-4">
          <div className="mb-2">
            <div
              className={`${hasImages ? "grid grid-cols-6 md:grid-cols-8" : "flex"} gap-2 my-2 w-3/4`}
            >
              {displayedVariants.map((variant) => {
                const hasImage = !!variant.image;
                const url = hasImage
                  ? `${rootUrl}variants/${encodeURIComponent(variant.image)}`
                  : "";
                return (
                  <Link
                    href={generateUrlWithVariant(
                      slug,
                      createVariantUrlParams(variant),
                    )}
                    key={variant.id}
                    className={`relative h-6 overflow-hidden rounded-full border border-gray-200 ${
                      hasImage ? "w-6" : "w-12"
                    }`}
                    title={hasImage ? variant.value : ""}
                  >
                    {hasImage ? (
                      <Image
                        src={url}
                        alt={variant.value}
                        width={24}
                        height={24}
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px]">
                        {variant.value.slice(0, 5) +
                          (variant.value.length > 5 ? "..." : "")}
                      </span>
                    )}
                  </Link>
                );
              })}

              {hiddenCount > 0 && (
                <div className="relative h-6 overflow-hidden border border-gray-200 w-10 rounded-md">
                  <span className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px]">
                    +{hiddenCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://homesync.ro");
      }
      let root = "https://" + domain + ".s3.eu-west-1.amazonaws.com/";
      setRootUrl(root);
    }
  }, []);

  useEffect(() => {
    if (rootUrl !== "") {
      setLoading(false);
    }
  }, [rootUrl]);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    // Check if the URL contains '.prismasolutions.ro' and remove it
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");

    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  const generateUrl = (link: string) => {
    // Create a URLSearchParams object from the link string
    const params = new URLSearchParams(link);

    // Convert the search params into a plain object
    const query = Object.fromEntries(params.entries());

    return {
      pathname: `/product/${slug}`,
      query: query,
    };
  };

  const generateUrlWithVariant = (slug: string, variants: number[]) => {
    const variantIds = variants.map((variant) => variant).join(",");
    return {
      pathname: "/product/" + slug,
      query: {
        variant: variantIds,
      },
    };
  };

  return !loading ? (
    <div
      className={`group relative flex flex-col m-2 p-3 sm:p-4 rounded-xl transition-all duration-300 sm:hover:scale-[1.015] bg-menu-bg-dark ${className}`}
      title={name}
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-transparent transition-all duration-300 sm:group-hover:rounded-2xl">
        <Link
          href={generateUrl(link)}
          className="relative h-full w-full flex justify-center"
        >
          <Image
            src={image ? rootUrl + "products/" + image : notfound}
            alt={name}
            width={250}
            height={250}
            className="h-[200px] sm:h-[250px] rounded-2xl object-center object-cover transition-transform duration-500 ease-in-out scale-95 sm:group-hover:scale-100 sm:group-hover:brightness-105"
            priority={index <= 8}
          />
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-[15px] line-clamp-3 text-menu-text-light font-medium leading-snug">
          <Link href={generateUrl(link)}>{name}</Link>
        </h3>

        <div className="mt-auto space-y-2">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((r) => (
                <StarIcon
                  key={r}
                  className={`h-4 w-4 ${rating > r ? "text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-m text-gray-300">({rating ?? 0})</span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-start space-x-2">
            {discountPriceInterval &&
            discountPriceInterval.minPrice > 0 &&
            discountPriceInterval.maxPrice > 0 &&
            priceInterval.minPrice > discountPriceInterval.minPrice ? (
              <div className="flex flex-col items-start">
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(priceInterval.minPrice)} {currency.symbol}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-primary-500 font-semibold flex items-center space-x-1">
                    <TagIcon className="h-5 w-5 text-primary-500" />
                    <span>
                      {formatPrice(discountPriceInterval.minPrice)}{" "}
                      {currency.symbol}
                    </span>
                  </span>
                  <span className="text-sm text-primary-500 font-semibold">
                    -
                    {Math.round(
                      ((priceInterval.minPrice -
                        discountPriceInterval.minPrice) /
                        priceInterval.minPrice) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
            ) : priceInterval.minPrice === priceInterval.maxPrice ? (
              <Prices price={priceInterval.minPrice} contentClass="py-1" />
            ) : (
              <Prices
                priceRange={formatPrice(priceInterval.minPrice)}
                contentClass="py-1"
              />
            )}
          </div>

          {/* Variants */}
          {data.variantTypes?.length > 0 && <div>{renderVariants()}</div>}
        </div>
      </div>
      <Link
        href={generateUrl(link)}
        className="absolute bottom-3 right-3 z-10 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
        title="Add to cart"
      >
        <ChevronDoubleRightIcon className="h-5 w-5" />
      </Link>
    </div>
  ) : null;
};

export default ProductCard;
