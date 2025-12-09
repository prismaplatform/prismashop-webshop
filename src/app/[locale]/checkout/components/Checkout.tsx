// Checkout.tsx

"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CartItem } from "@/models/cart-item.model";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/slices/cartSlice";
import {
  NewOrderDto,
  OrderDto,
  OrderItemDto,
  PaymentType,
  ProductOptionDto,
} from "@/models/order-detail.model";
import { createNewOrder, requestPaymentUrl } from "@/api/orders";
import { clearOrder } from "@/lib/slices/orderDetailSlice";
import { Route } from "next";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Prices from "@/components/ui/Prices/Prices";
import NcInputNumber from "@/components/ui/NcInputNumber/NcInputNumber";
import ContactInfo from "@/app/[locale]/checkout/components/ContactInfo";
import BillingAddress from "@/app/[locale]/checkout/components/BillingAddress";
import PaymentMethod from "@/app/[locale]/checkout/components/PaymentMethod";
import { useLocale, useTranslations } from "next-intl";
import { CourierPrice } from "@/models/courier-price.model";
import { getCourierPrice } from "@/api/company";
import { useCurrency } from "@/components/app/CurrencyProvider";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart) || [];
  const orderDetailsState = useSelector(
    (state: RootState) => state.orderDetails,
  );

  const t = useTranslations("Pages.Checkout");
  const tSummary = useTranslations("Pages.Checkout.Summary");
  const tCart = useTranslations("Pages.Cart");
  const currency = useCurrency();
  const locale = useLocale();

  const [clientCart, setClientCart] = useState<CartItem[]>([]);
  const [rootUrl, setRootUrl] = useState("");
  const [courierPrice, setCourierPrice] = useState<CourierPrice>();
  const [activeStep, setActiveStep] = useState<
    "ContactInfo" | "BillingAddress" | "PaymentMethod"
  >("ContactInfo");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isClient, setIsClient] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const phoneRegexHU =
    /^(?:\+36|06)(?:20|30|31|50|70|1\d|2\d|3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{6,7}$/;
  const phoneRegexRO = /^(?:\+40|0)(?:7\d{8}|2\d{8}|3\d{8})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const formatPrice = (value: number) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://letrafutar.hu");
      }
      let root = "https://" + domain + ".s3.eu-west-1.amazonaws.com/products/";
      setRootUrl(root);
    }
  }, []);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    host = host.replace(".prismasolutions.ro", "");
    host = host.replace(".prismaweb.ro", "");
    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const fetchCourierPrice = async () => {
      const constCourierPrice: CourierPrice = await getCourierPrice();
      setCourierPrice(constCourierPrice);
    };
    fetchCourierPrice();
  }, []);

  useEffect(() => {
    setClientCart(cart);
  }, [cart]);

  useEffect(() => {
    if (typeof window === "undefined" || clientCart.length === 0) return;

    const items = clientCart.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      brand: item.brand,
      categories: item.categories,
      price: item.discountPrice || item.price,
      quantity: item.quantity,
    }));

    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        value: totalValue,
        currency: currency.code,
        items,
      },
    });
  }, [clientCart, currency.code]);

  const validation = useMemo(() => {
    const phone = orderDetailsState.customer?.phone?.trim() || "";
    const email = orderDetailsState.customer?.email?.trim() || "";

    const isPhoneValid = phoneRegexHU.test(phone) || phoneRegexRO.test(phone);
    const isEmailValid = emailRegex.test(email);

    const isCustomerInfoValid =
      !!orderDetailsState.customer?.id && isPhoneValid && isEmailValid;
    const isAddressValid = !!orderDetailsState.customerAddress?.id;
    const isPaymentValid = !!orderDetailsState.paymentType;
    const isCartValid =
      cart.length > 0 &&
      cart.every(
        (item) => Number.isInteger(item.id) && item.id > 0 && item.quantity > 0,
      );

    const allValid =
      isCustomerInfoValid && isAddressValid && isPaymentValid && isCartValid;

    let tooltipMessage = "";
    if (!allValid) {
      if (!isCustomerInfoValid) {
        if (!isPhoneValid) tooltipMessage = t("Summary.errors.phone");
        else if (!isEmailValid) tooltipMessage = t("Summary.errors.email");
        else tooltipMessage = t("Summary.errors.customer");
      } else if (!isAddressValid) tooltipMessage = t("Summary.errors.address");
      else if (!isPaymentValid) tooltipMessage = t("Summary.errors.payment");
      else if (!isCartValid) tooltipMessage = t("Summary.errors.cart");
    }

    return { isValid: allValid, tooltipMessage };
  }, [orderDetailsState, cart, t]);

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleCreateOrder = async () => {
    if (submittingRef.current || isSubmitting) return; // prevents race condition

    submittingRef.current = true;
    setIsSubmitting(true);

    if (!validation.isValid) {
      return;
    }

    let orderItems: OrderItemDto[] = cart.map((item) => ({
      productOption: {
        id: item.id,
        product: {
          vat: item.tvaPercent,
        },
      } as ProductOptionDto,
      quantity: item.quantity,
      discount: item.discount,
      price: item.price,
    }));

    let order: NewOrderDto = {
      customer: orderDetailsState.customer,
      customerAddress: orderDetailsState.customerAddress,
      observation: orderDetailsState.observation,
      orderItems,
      paymentType: orderDetailsState.paymentType,
      lang: locale || "no_lang",
    };

    try {
      setIsSubmitting(true);
      const res: OrderDto = await createNewOrder(order);

      if (typeof window !== "undefined") {
        const items = cart.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          brand: item.brand,
          categories: item.categories,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        }));

        const totalDiscountPrices = clientCart.reduce(
          (acc, item) => acc + (item.discountPrice || 0) * item.quantity,
          0,
        );

        const shippingCost =
          courierPrice &&
          (totalDiscountPrices < courierPrice.defaultExpectedCourierMin
            ? courierPrice.defaultExpectedCourierPrice
            : 0);

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "purchase",
          ecommerce: {
            transaction_id: res.transactionId,
            value: totalDiscountPrices + (shippingCost || 0),
            currency: currency.code,
            shipping: shippingCost || 0,
            items,
          },
        });
      }

      if (res.paymentType == PaymentType.CARD_PAYMENT) {
        dispatch(clearOrder());
        dispatch(clearCart());

        if (res.id) {
          const link = await requestPaymentUrl(res.id);
          if (link) {
            window.location.href = link;
          }
        }
      } else {
        dispatch(clearOrder());
        const link: string = "/confirmation/" + res.transactionId;
        dispatch(clearCart());
        router.replace(link as Route);
      }
    } catch (error) {
      console.error("Order creation failed", error);
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
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
    } = item;
    const imageUrl = rootUrl + image;
    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-white">
          <Image
            fill
            src={imageUrl}
            alt={name}
            priority={true}
            sizes="150px"
            className="h-full w-full object-contain object-center"
          />
          <Link
            href={JSON.parse(link) as Route}
            className="absolute inset-0"
          ></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold text-menu-text-light">
                  <Link href={JSON.parse(link) as Route}>{name}</Link>
                </h3>
                <div className="hidden flex-1 sm:flex ">
                  <Prices
                    price={price}
                    discountPrice={discountPrice}
                    className="mt-0.5"
                  />
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(id, Number(e.target.value))
                    }
                    className="form-select text-sm rounded-md py-1 border-accent-200 dark:border-accent-700 relative z-10 dark:bg-accent-800 "
                  >
                    {Array.from(
                      { length: Math.min(currentStock || 10, 10) },
                      (_, i) => i + 1,
                    ).map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={price}
                    discountPrice={discountPrice}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumber
                defaultValue={quantity}
                max={currentStock}
                min={0}
                onChange={(value) => handleQuantityChange(id, value)}
                className="relative z-10 text-menu-text-light"
              />
            </div>

            <button
              onClick={() => handleRemove(id)}
              className="relative z-10 flex items-center mt-3 font-medium text-menu-text-light hover:text-primary-500 text-sm "
            >
              <span>{tCart("remove")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            isActive={activeStep === "ContactInfo"}
            onOpenActive={() => {
              setActiveStep("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setActiveStep("BillingAddress");
              handleScrollToEl("BillingAddress");
            }}
          />
        </div>

        <div id="BillingAddress" className="scroll-mt-24">
          <BillingAddress
            isActive={activeStep === "BillingAddress"}
            onOpenActive={() => {
              setActiveStep("BillingAddress");
              handleScrollToEl("BillingAddress");
            }}
            onCloseActive={() => {
              setActiveStep("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={activeStep === "PaymentMethod"}
            onOpenActive={() => {
              setActiveStep("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => {
              setActiveStep("PaymentMethod");
            }}
          />
        </div>
      </div>
    );
  };

  const total = clientCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const totalDiscountPrices = clientCart.reduce(
    (acc, item) => acc + (item.discountPrice || 0) * item.quantity,
    0,
  );

  const hasDiscount = total > totalDiscountPrices;

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl text-menu-text-light sm:text-3xl lg:text-4xl font-semibold ">
            {t("title")}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-accent-200 dark:border-accent-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold text-menu-text-light">
              {tSummary("title")}
            </h3>
            <div className="mt-8 divide-y divide-accent-200/70 dark:divide-accent-700 ">
              {clientCart.map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-menu-text-light dark:text-accent-400 border-t border-accent-200/70 dark:border-accent-700 ">
              {/*<div>*/}
              {/* <Label className="text-sm">{t("discount")}</Label>*/}
              {/* <div className="flex mt-1.5">*/}
              {/* <Input sizeClass="h-10 px-4 py-3" className="flex-1" />*/}
              {/* <button className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">*/}
              {/* {t("apply")}*/}
              {/* </button>*/}
              {/* </div>*/}
              {/*</div>*/}

              {!hasDiscount ? (
                <>
                  <div className="mt-4 flex justify-between py-2.5">
                    <span>{tSummary("subtotal")}</span>
                    <span>
                      <span
                        className="font-semibold text-menu-text-light dark:text-accent-200"
                        data-subtotal-value={formatPrice(total)}
                        id={"subtotal-value"}
                      >
                        {formatPrice(total)}{" "}
                      </span>
                      <span>{currency.symbol}</span>
                    </span>
                  </div>
                  {courierPrice && (
                    <div className="flex justify-between py-2.5">
                      <span>{tSummary("transport")}</span>
                      <span className="font-semibold text-menu-text-light dark:text-accent-200">
                        <span>
                          {courierPrice.defaultExpectedCourierMin >
                          totalDiscountPrices
                            ? formatPrice(
                                courierPrice.defaultExpectedCourierPrice,
                              )
                            : 0.0}{" "}
                          {currency.symbol}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-menu-text-light dark:text-accent-200 text-base pt-4">
                    <span>{tSummary("total")}</span>
                    <span>
                      {formatPrice(
                        total +
                          (courierPrice?.defaultExpectedCourierPrice &&
                          total < courierPrice.defaultExpectedCourierMin
                            ? courierPrice?.defaultExpectedCourierPrice
                            : 0),
                      )}{" "}
                      {currency.symbol}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 flex justify-between py-2.5">
                    <span>{tSummary("subtotal")}</span>
                    <span className="font-semibold text-menu-text-light dark:text-accent-200">
                      <span className="line-through me-2">
                        <span>{formatPrice(total)} </span>
                        <span>{currency.symbol}</span>
                      </span>
                      <span>
                        <span
                          data-subtotal-value={formatPrice(total)}
                          id={"subtotal-value"}
                        >
                          {formatPrice(totalDiscountPrices)}{" "}
                        </span>
                        <span>{currency.symbol}</span>
                      </span>
                    </span>
                  </div>

                  {courierPrice && (
                    <div className="flex justify-between py-2.5">
                      <span>{tSummary("transport")}</span>
                      <span className="font-semibold text-menu-text-light dark:text-accent-200">
                        <span>
                          {totalDiscountPrices <
                          courierPrice.defaultExpectedCourierMin
                            ? formatPrice(
                                courierPrice.defaultExpectedCourierPrice,
                              )
                            : 0.0}{" "}
                          {currency.symbol}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-menu-text-light dark:text-accent-200 text-base pt-4">
                    <span>{tSummary("total")}</span>
                    <span className="font-semibold text-menu-text-light dark:text-accent-200">
                      <span className="line-through me-2">
                        {formatPrice(
                          total +
                            (courierPrice &&
                            total < courierPrice.defaultExpectedCourierMin
                              ? courierPrice.defaultExpectedCourierPrice
                              : 0),
                        )}{" "}
                        {currency.symbol}
                      </span>
                      <span>
                        {formatPrice(
                          totalDiscountPrices +
                            (courierPrice &&
                            total < courierPrice.defaultExpectedCourierMin
                              ? courierPrice.defaultExpectedCourierPrice
                              : 0),
                        )}{" "}
                        {currency.symbol}
                      </span>
                    </span>
                  </div>
                </>
              )}
            </div>
            <div
              className="relative"
              title={isClient ? validation.tooltipMessage : ""}
            >
              <TermsCheckbox
                id="CheckoutTerms"
                checked={acceptTerms}
                onChange={setAcceptTerms}
                className="mt-8"
                name="CheckoutTerms"
              />
              <div className="mt-5 text-sm text-menu-text-light dark:text-accent-400 flex items-center">
                <p className="block relative pl-5">
                  <svg
                    className="w-4 h-4 absolute -left-1 top-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9945 16H12.0035"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {tSummary("learnMore")}
                  {` `}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={tSummary("route") as Route}
                    className="text-menu-text-light dark:text-accent-200 underline font-medium"
                  >
                    {tSummary("shipping")}
                  </a>
                  <span>
                    {` `}
                    {tSummary("and")}
                    {` `}
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={tSummary("route") as Route}
                    className="text-menu-text-light dark:text-accent-200 underline font-medium"
                  >
                    {tSummary("return")}
                  </a>
                </p>
              </div>
              <button
                onClick={handleCreateOrder}
                className={`mt-4 w-full py-3 px-4 sm:py-3.5 sm:px-6 font-semibold nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors ${
                  isClient && validation.isValid && acceptTerms
                    ? "bg-primary-500 text-accent-100"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={
                  !isClient ||
                  !validation.isValid ||
                  !acceptTerms ||
                  isSubmitting
                }
              >
                {isSubmitting
                  ? tSummary("confirm") + "..."
                  : tSummary("confirm")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
