"use client";
import { CartItem } from "@/models/cart-item.model";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { removeFromCart, updateQuantity } from "@/lib/slices/cartSlice";
import { Link } from "@/i18n/routing";
import Prices from "@/components/ui/Prices/Prices";
import NcInputNumber from "@/components/ui/NcInputNumber/NcInputNumber";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionSliderProductCard from "@/components/layout/FeaturedProducts/SectionSliderProductCard";
import { getRelatedProducts } from "@/api/products";
import { ShortProductOptionDto } from "@/models/product.model";
import { useCurrency } from "@/components/app/CurrencyProvider";

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart) || [];
  const dispatch = useDispatch();

  // Prevent hydration issues by initializing state on client
  const [clientCart, setClientCart] = useState<CartItem[]>([]);
  const [rootUrl, setRootUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Pages.Cart");
  const currency = useCurrency();
  const [recommendedProducts, setRecommendedProducts] = useState<
    ShortProductOptionDto[]
  >([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://homesync.ro");
      }
      if (domain.includes("localhost")) {
      }
      let root = "https://" + domain + ".s3.eu-west-1.amazonaws.com/products/";
      setRootUrl(root);
    }
  }, []);

  const formatPrice = (value: number) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  };

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    // Check if the URL contains '.prismasolutions.ro' and remove it
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");

    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  // Ensure loading is true initially
  useEffect(() => {
    if (rootUrl != "" && clientCart) {
      setLoading(false);
    }
  }, [rootUrl, clientCart]);

  useEffect(() => {
    setClientCart(cart);
  }, [cart]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      const productIds = clientCart
        .map((item) => {
          try {
            const linkObj = JSON.parse(item.link);
            const query = new URLSearchParams(linkObj.query);
            const id = query.get("id");
            return id ? parseInt(id, 10) : null;
          } catch (e) {
            console.error("Invalid link format:", item.link);
            return null;
          }
        })
        .filter((id): id is number => Boolean(id));

      if (productIds.length === 0) return;

      try {
        const data = await getRelatedProducts(productIds);
        setRecommendedProducts(data);
      } catch (err) {
        console.error("Error fetching recommended products:", err);
      }
    };

    if (clientCart.length > 0) {
      fetchRecommendedProducts();
    }
  }, [clientCart]);

  const products = recommendedProducts;

  useEffect(() => {
    if (clientCart.length > 0 && rootUrl) {
      window.dataLayer = window.dataLayer || [];

      // Clear previous ecommerce object
      window.dataLayer.push({ ecommerce: null });

      const items = cart.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        item_brand: item.brand,
        sku: item.sku,
        item_category: item.categories,
        stock: item.stock,
        image: item.image,
        url: rootUrl + JSON.parse(item.link).query,
        price: item.discountPrice || item.price,
        quantity: item.quantity,
      }));

      const cartValue = clientCart.reduce(
        (total, item) =>
          total +
          (parseFloat(String(item.price)) || 0) *
            (parseInt(String(item.quantity), 10) || 0),
        0,
      );

      // Push view_cart event
      window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
          value: cartValue,
          currency: currency.code,
          items,
        },
      });
    }
  }, [clientCart, rootUrl]);

  const handleRemove = (id: number) => {
    const itemToRemove = cart.find((item) => item.id === id);

    if (itemToRemove) {
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({ ecommerce: null });

      // Push remove_from_cart event
      window.dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
          remove: {
            products: [
              {
                item_id: itemToRemove.id,
                item_name: itemToRemove.name,
                price: itemToRemove.price,
                sku: itemToRemove.sku,
                quantity: itemToRemove.quantity,
                image: rootUrl + itemToRemove.image,
                url: rootUrl + JSON.parse(itemToRemove.link).query,
              },
            ],
          },
        },
      });
      dispatch(removeFromCart(id));
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const renderProduct = (item: CartItem, index: number) => {
    const {
      image,
      price,
      discountPrice,
      name,
      quantity,
      id,
      link,
      currentStock,
      stock,
    } = item;
    const imageUrl = rootUrl + image;
    return (
      <div
        key={id}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            fill
            src={imageUrl}
            alt={name}
            priority={true}
            sizes="150px"
            className="h-full w-full object-contain object-center"
          />
          <Link href={JSON.parse(link)} className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div className="flex justify-between">
            <div className="flex-[1.5]">
              <h3 className="text-menu-text-light font-semibold">
                <Link href={JSON.parse(link)}>{name}</Link>
              </h3>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-right text-sm">
            <div className="sm:block text-center">
              <div className="flex justify-center mb-2">
                <Prices
                  price={price * quantity}
                  discountPrice={discountPrice * quantity}
                  contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                />
              </div>
              <div className="flex-shrink-0 flex items-center justify-center bg-menu-bg-light px-3 py-2 rounded-full">
                <NcInputNumber
                  max={currentStock}
                  min={0}
                  defaultValue={quantity}
                  onChange={(value) => handleQuantityChange(id, value)}
                  className="text-menu-text-light"
                />
              </div>
            </div>
            <button
              aria-label="remove item"
              onClick={() => handleRemove(id)}
              className="relative z-10 font-medium text-menu-text-light hover:text-primary-500 text-sm"
            >
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const total = clientCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalDiscountPrices = clientCart.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0,
  );

  const taxSubtotal = clientCart.reduce(
    (acc, item) => acc + (item.vat ?? 0) * item.quantity,
    0,
  );

  const taxDiscountSubtotal = clientCart.reduce(
    (acc, item) => acc + (item.vatDiscount ?? 0) * item.quantity,
    0,
  );

  const subtotal = total - taxSubtotal;
  const discountSubtotal = totalDiscountPrices - taxDiscountSubtotal;

  const hasDiscount = total > totalDiscountPrices;

  return (
    !loading && (
      <div className="nc-CartPage">
        <main className="container py-16 lg:pb-28 lg:pt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-12 sm:mb-16 text-menu-text-light">
            {t("title")}
          </h2>
          <hr className="border-accent-200 dark:border-accent-700 my-10 xl:my-12" />

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-accent-200 dark:divide-accent-700 text-menu-text-light">
              {clientCart.length > 0 ? (
                clientCart.map(renderProduct)
              ) : (
                <p>{t("emptyCart")}</p>
              )}
            </div>
            <div className="border-t lg:border-t-0 lg:border-l border-accent-200 dark:border-accent-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="sticky top-28">
                <h3 className="text-lg font-semibold text-menu-text-light">
                  {t("orderSummary")}
                </h3>
                {hasDiscount ? (
                  <div className="mt-7 text-sm text-menu-text-light dark:text-accent-400 divide-y divide-accent-200/70 dark:divide-accent-700/80">
                    <div className="flex justify-between pb-4">
                      <span>{t("subtotal")}</span>
                      <span className="font-semibold text-menu-text-light dark:text-accent-200">
                        <span className="line-through me-2">
                          {formatPrice(total)} {currency.symbol}
                        </span>
                        <span>{formatPrice(totalDiscountPrices)}</span>{" "}
                        {currency.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-menu-text-light dark:text-accent-200 text-base pt-4">
                      <span>{t("total")}</span>
                      <span className="font-semibold text-menu-text-light dark:text-accent-200">
                        <span className="line-through me-2">
                          {formatPrice(total)} {currency.symbol}
                        </span>
                        <span>
                          {formatPrice(totalDiscountPrices)} {currency.symbol}
                        </span>
                      </span>
                    </div>
                    <span className="font-light dark:text-accent-200 mt-4 block">
                      {t("VATIncluded")} {t("totalInfo")}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mt-7 text-sm text-menu-text-light dark:text-accent-400 divide-y divide-accent-200/70 dark:divide-accent-700/80">
                      <div className="flex justify-between pb-4 ">
                        <span>{t("productTotal")}</span>
                        <span className="font-semibold text-menu-text-light dark:text-accent-200">
                          {formatPrice(total)} {currency.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-menu-text-light dark:text-accent-200 text-base pt-4">
                        <span>{t("total")}</span>
                        <span>
                          {formatPrice(total)} {currency.symbol}
                        </span>
                      </div>
                    </div>
                    <span className="font-light text-menu-text-light dark:text-accent-200 mt-4 block">
                      {t("VATIncluded")} {t("totalInfo")}
                    </span>
                  </>
                )}
                <ButtonPrimary href="/checkout" className="mt-8 w-full">
                  {t("checkout")}
                </ButtonPrimary>
              </div>
            </div>
          </div>
          {products.length > 0 && (
            <>
              <hr className="my-10 xl:my-12 border-accent-200 dark:border-accent-700" />
              <SectionSliderProductCard
                heading={t("relatedProducts")}
                subHeading=""
                products={products}
              />
            </>
          )}
        </main>
      </div>
    )
  );
}
