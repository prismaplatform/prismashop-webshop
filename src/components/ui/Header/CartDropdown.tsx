"use client";

import { Popover, PopoverButton, PopoverPanel, Transition } from "@/app/ui/headlessui";
import Prices from "@/components/ui/Prices/Prices";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import React, { useEffect, useState } from "react";
import { CartItem } from "@/models/cart-item.model";
import { removeFromCart } from "@/lib/slices/cartSlice";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/components/app/CurrencyProvider";

export default function CartDropdown() {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart) || [];
  // Prevent hydration issues by initializing state on client
  const [clientCart, setClientCart] = useState<CartItem[]>([]);
  const [rootUrl, setRootUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Header.HeaderDropdowns.Cart");
  const tCart = useTranslations("Pages.Cart");
  const currency = useCurrency();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://homesync.ro");
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

  const handleRemove = (id: number) => {
    const itemToRemove = cart.find((item) => item.id === id);

    if (itemToRemove) {
      // Ensure window.dataLayer is initialized
      window.dataLayer = window.dataLayer || [];

      // Clear any previous ecommerce data (optional)
      window.dataLayer.push({ ecommerce: null });

      // Push remove_from_cart event to GTM
      window.dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
          remove: {
            products: [
              {
                id: itemToRemove.id,
                name: itemToRemove.name,
                brand: itemToRemove.brand,
                sku: itemToRemove.sku,
                categories: itemToRemove.categories,
                price: itemToRemove.price,
                quantity: itemToRemove.quantity,
                image: rootUrl + itemToRemove.image,
                url: rootUrl + JSON.parse(itemToRemove.link).query,
              },
            ],
          },
        },
      });

      // Dispatch the Redux action to remove the item from the cart
      dispatch(removeFromCart(id));
    }
  };

  const total = clientCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalDiscountPrices = clientCart.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0,
  );

  const hasDiscount = total > totalDiscountPrices;
  const cartSize = clientCart.reduce((acc, item) => acc + item.quantity, 0);

  const renderProduct = (item: CartItem, index: number, close: () => void) => {
    const { image, price, discountPrice, name, quantity, id, link } = item;
    const imageUrl = rootUrl + image;
    return (
      !loading && (
        <div key={index} className="flex py-5 last:pb-0">
          <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl">
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

          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between ">
                <div>
                  <h5 className="font-medium text-xs">
                    <Link onClick={close} href={JSON.parse(link)}>
                      {name}
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
            <div>
              <Prices
                price={price}
                discountPrice={discountPrice}
                className="mt-0.5 text-xs"
              />
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-menu-text-light">{`${tCart("quantity")} ${quantity}`}</p>
              <div className="flex">
                <button
                  type="button"
                  className="font-medium text-primary-6000 "
                  onClick={() => handleRemove(id)}
                >
                  {tCart("remove")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => {
        useEffect(() => {
          if (open) {
            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
              event: "view_cart",
              ecommerce: {
                items: clientCart.map((item) => ({
                  id: item.id,
                  name: item.name,
                  brand: item.brand,
                  sku: item.sku,
                  categories: item.categories,
                  price: item.price.toString(),
                  quantity: item.quantity,
                  image: rootUrl + item.image,
                  url: rootUrl + JSON.parse(item.link).query,
                })),
              },
            });
          }
        }, [open, clientCart]);

        return (
          <>
            <PopoverButton
              className={`
                  ${open ? "" : "text-opacity-90"}
                   group w-10 h-10 sm:w-12 sm:h-12 hover:bg-menu-bg-light rounded inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded text-[10px] leading-none text-white font-medium">
                <span className="mt-[1px]">{cartSize}</span>
              </div>
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8H21"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <Link
                aria-label="open-cart"
                className="block md:hidden absolute inset-0"
                href={"/cart"}
              />
            </PopoverButton>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                  <div className="relative bg-menu-bg-light dark:bg-neutral-800">
                    <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">
                          {t("shoppingCart")}
                        </h3>
                        <button
                          type="button"
                          onClick={close}
                          className="text-xl font-bold text-accent-600 hover:text-accent-900 dark:text-accent-300 dark:hover:text-accent-100"
                        >
                          &times;
                        </button>
                      </div>

                      <div className="divide-y divide-accent-100 dark:divide-accent-700">
                        {clientCart.map((item, index) =>
                          renderProduct(item, index, close),
                        )}
                      </div>
                    </div>
                    <div className="bg-menu-bg-dark dark:bg-accent-900 p-5">
                      <p className="flex justify-between font-semibold text-menu-text-light dark:text-accent-100">
                        <span className="flex-1">
                          <span>{t("total")}</span>
                          <span className="block text-sm text-menu-text-light dark:text-accent-400 font-normal">
                            {t("totalInfo")}
                          </span>
                        </span>

                        <span className="flex-shrink-0 whitespace-nowrap">
                          {hasDiscount
                            ? `${formatPrice(totalDiscountPrices)} ${currency.symbol}`
                            : `${formatPrice(total)} ${currency.symbol}`}
                        </span>
                      </p>
                      <div className="flex space-x-10 mt-5">
                        <ButtonSecondary
                          href="/cart"
                          className="flex-1 border border-accent-200 dark:border-accent-700"
                          onClick={close}
                        >
                          {t("viewCart")}
                        </ButtonSecondary>
                        <ButtonPrimary
                          href="/checkout"
                          onClick={close}
                          className="flex-1"
                        >
                          {t("checkOut")}
                        </ButtonPrimary>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
}
