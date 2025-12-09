"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Prices from "@/components/ui/Prices/Prices";
import { VariantDto } from "@/models/variant.model";
import { useTranslations } from "next-intl";

// --- Type Definitions for Props ---
// Defining specific types for props improves type safety and autocompletion.
interface ProductImage {
  image: string;
}

interface ProductOption {
  images: ProductImage[];
  variants: VariantDto[]; // Using the imported VariantDto
  product: {
    name: string;
    slug: string;
  };
}

interface OrderItem {
  productOption: ProductOption;
  price: number;
  tax: number;
  quantity: number;
}

interface ProductItemProps {
  item: OrderItem;
  rootUrl: string;
}

// --- Helper Functions ---
// Moved outside the component to prevent re-creation on every render.
const generateProductUrl = (slug: string, variants: VariantDto[]) => {
  const variantIds = variants
    .map((variant) => variant.variantValue.id)
    .join(",");

  const query: { variant?: string } = {};
  if (variantIds) {
    query.variant = variantIds;
  }

  return {
    pathname: "/product/"+slug,
    query,
  };
};

// --- Main Component ---
const ProductItem = ({ item, rootUrl }: ProductItemProps) => {
  // Destructure with fallbacks to prevent runtime errors if data is incomplete.
  const { productOption, price = 0, tax = 0, quantity = 1 } = item || {};
  const { product, images, variants = [] } = productOption || {};
  const t = useTranslations("Pages.Account.Orders");

  // Safely access image URL and provide a placeholder if none exists.
  const imageUrl =
    images && images.length > 0
      ? `${rootUrl}${images[0].image}`
      : `https://placehold.co/150x150/e2e8f0/e2e8f0?text=Image`; // Placeholder image

  // Safely construct variant string.
  const variantValues =
    variants
      .map((v) => v.variantValue?.value)
      .filter(Boolean)
      .join(" / ") || "";

  // Handle cases where product data might be missing.
  if (!product) {
    // Render a fallback state if the essential product data is not available.
    return (
      <div className="flex py-4 sm:py-7 text-accent-500">
        {t("noProductInfo")}
      </div>
    );
  }

  const productUrl = generateProductUrl(product.slug, variants);

  return (
    <div className="flex py-4 sm:py-6 gap-4">
      {/* Image Column */}
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl">
        <Image
          fill
          src={imageUrl}
          alt={product.name || "Product image"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover object-center"
          priority // Consider setting priority based on position (e.g., for above-the-fold items)
        />
        {/* The link now wraps the image for a clear clickable area */}
        <Link
          href={productUrl}
          className="absolute inset-0"
          aria-label={`View ${product.name}`}
        />
      </div>

      {/* Details Column */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          {/* Product Name, Variants, and Link */}
          <div>
            <h3 className="text-base font-medium">
              <Link
                href={productUrl}
                className="hover:text-primary-500 transition-colors"
              >
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-accent-500 dark:text-accent-400">
              {variantValues}
            </p>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 ml-4">
            <Prices price={price + tax} />
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-end text-sm">
          <p className="text-gray-500 dark:text-accent-400">
            {t("quantity")}: {quantity}
          </p>
        </div>
      </div>
    </div>
  );
};
export default React.memo(ProductItem);
