"use client";

import React, { FC, useEffect, useState } from "react";
import notfound from "/public/no-image.png";
import { ShortProductOptionDto } from "@/models/product.model";
import { VariantDto } from "@/models/variant.model";
import { ShoppingCartIcon, StarIcon, TagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Prices from "../../ui/Prices/Prices";
import { Button } from "@headlessui/react";
import { addOrUpdateCart } from "@/lib/slices/cartSlice";
import { CartItem } from "@/models/cart-item.model";
import { useCurrency } from "@/components/app/CurrencyProvider";
import { useDispatch } from "react-redux";
import NotifyAddToCartPortal from "@/components/ui/NotificationPortal/NotifyAddToCartPortal";

export interface ProductCardProps {
  className?: string;
  data: ShortProductOptionDto;
  index: number;
}

const ProductOptionCard: FC<ProductCardProps> = ({
  className = "",
  data,
  index,
}) => {
  const {
    name,
    images,
    sellPrice,
    discountPrice,
    variants,
    productSlug,
    rating,
  } = data;
  const [rootUrl, setRootUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const currency = useCurrency();
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const handleCloseNotification = () => {
    setNotificationVisible(false);
  };
  const dispatch = useDispatch();

  const addToCart = (product: ShortProductOptionDto) => {
    if (product) {
      let cartItem: CartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand.name || "Unknown Brand",
        categories: product.categories?.toString() || "Uncategorized",
        image: product.images[0].image,
        link: JSON.stringify(generateUrl(productSlug, variants)),
        price: product.sellPrice,
        discountPrice: product.discountPrice || product.sellPrice,
        tvaPercent: product.vat || 19,
        quantity: 1,
        stock: product.stock,
        sku: product.sku,
        currentStock: product.stock - 1,
      };

      setNotificationVisible(true);
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 3000); // Notification will disappear after 3 seconds

      dispatch(addOrUpdateCart(cartItem));

      // Prepare GTM tracking data
      const productData = {
        id: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        stock: cartItem.stock,
        quantity: cartItem.quantity,
        image_url: cartItem.image,
        product_url: generateUrl(productSlug, variants),
        brand: product.brand.name || "Unknown Brand",
        category: product.categories || "Uncategorized",
      };

      // Only push to dataLayer if productData is valid
      if (productData && Object.keys(productData).length > 0) {
        window.dataLayer = window.dataLayer || [];

        // Clear previous ecommerce data
        window.dataLayer.push({ ecommerce: null });

        // Push add_to_cart event only if data is valid
        if (productData.id && productData.name && productData.price) {
          window.dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
              currency: currency.code,
              add: {
                products: [productData],
              },
            },
          });
        }
      }

      return () => clearTimeout(timer);
    }
  };

  const formatPrice = (value: number): string => {
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://letrafutar.hu");
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

  const generateUrl = (productSlug: string, variants: VariantDto[]) => {
    const variantIds = variants
      .map((variant) => variant.variantValue.id)
      .join(",");
    return {
      pathname: "/product/" + productSlug,
      query: variantIds
        ? {
            variant: variantIds,
          }
        : {},
    };
  };

  return !loading ? (
    <div
      className={`group relative flex flex-col p-2 sm:p-4 rounded-xl transition-all duration-300 sm:hover:scale-[1.015] bg-menu-bg-dark h-[370px] lg:h-[420px] ${className}`}
      title={name}
    >
      {images?.[0]?.image && (
        <NotifyAddToCartPortal
          name={name || ""}
          productImage={rootUrl + "products/" + images[0].image}
          show={isNotificationVisible}
          onClose={handleCloseNotification}
        />
      )}

      <div className="aspect-square overflow-hidden rounded-xl bg-transparent transition-all duration-300 sm:group-hover:rounded-2xl">
        <Link
          href={generateUrl(productSlug, variants)}
          className="relative h-full w-full flex justify-center"
        >
          <Image
            src={
              images && images?.length
                ? rootUrl + "products/" + images[0]?.image
                : notfound
            }
            alt={name}
            width={250}
            height={250}
            className="h-[200px] sm:h-[250px] rounded-2xl object-center object-contain transition-transform duration-500 ease-in-out scale-95 sm:group-hover:scale-100 sm:group-hover:brightness-105"
            priority={index <= 8}
          />
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <h3 className="text-[15px] line-clamp-3 text-menu-text-light font-medium leading-snug">
          <Link href={generateUrl(productSlug, variants)}>{name}</Link>
        </h3>

        <div className="mt-2 flex items-center space-x-1">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((r) => (
              <StarIcon
                key={r}
                className={`h-4 w-4 ${rating > r ? "text-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-menu-text-light">({rating ?? 0})</span>
        </div>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-start space-x-2">
        {discountPrice && discountPrice > 0 ? (
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(sellPrice)} {currency.symbol}
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-primary-500 font-semibold flex items-center space-x-1">
                <TagIcon className="h-5 w-5 text-primary-500" />
                <span>
                  {formatPrice(discountPrice)} {currency.symbol}
                </span>
              </span>
              <span className="text-sm text-primary-500 font-semibold">
                -{Math.round(((sellPrice - discountPrice) / sellPrice) * 100)}%
              </span>
            </div>
          </div>
        ) : (
          <Prices price={sellPrice} contentClass="py-1" />
        )}
      </div>

      {variants?.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5">
          {variants.slice(0, 3).map((variant) => {
            const hasImage = !!variant.variantValue.image;
            const value = variant.variantValue.value;
            const showText = !hasImage && value.length <= 10;

            if (!hasImage && !showText) return null;

            return (
              <div
                key={variant.id}
                className={`relative h-6 overflow-hidden rounded-full border border-gray-200 ${
                  hasImage ? "w-6" : "w-12"
                }`}
                title={hasImage ? value : ""}
              >
                {hasImage ? (
                  <Image
                    src={`${rootUrl}variants/${variant.variantValue.image}`}
                    alt={value}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px]">
                    {value.slice(0, 5) + (value.length > 5 ? "..." : "")}
                  </span>
                )}
              </div>
            );
          })}
          {variants.length > 3 && (
            <span className="text-xs text-gray-400">
              +{variants.length - 3}
            </span>
          )}
        </div>
      )}
      <Button
        onClick={() => addToCart(data)}
        data-add-to-cart-button={"Add To Cart"}
        className="absolute bottom-3 right-3 z-10 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
        aria-label="Add to cart"
        id={"add-to-cart-button"}
      >
        <ShoppingCartIcon className="h-5 w-5" />
      </Button>
    </div>
  ) : null;
};

export default ProductOptionCard;
