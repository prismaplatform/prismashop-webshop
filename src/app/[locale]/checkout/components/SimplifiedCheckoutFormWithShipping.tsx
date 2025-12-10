"use client";

import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import Cookies from "js-cookie";
import { Route } from "next";

// --- UI komponens importok ---
import Label from "@/components/ui/Label/Label";
import Input from "@/components/ui/Input/Input";
import Radio from "@/components/ui/Radio/Radio";
import Select from "@/components/ui/Select/Select";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import Prices from "@/components/ui/Prices/Prices";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";
import NcInputNumber from "@/components/ui/NcInputNumber/NcInputNumber";

// --- Redux és State importok ---
import { RootState } from "@/lib/store";
import {
  BillingAddressDto,
  BillingType,
  CustomerAddressDto,
  NewOrderDto,
  OrderDto,
  OrderItemDto,
  PaymentType,
  ProductOptionDto,
  Role,
  ShippingAddressDto,
  UserResponseDto,
} from "@/models/order-detail.model";
import { CartItem } from "@/models/cart-item.model";
import { clearCart, updateQuantity } from "@/lib/slices/cartSlice";
import { clearOrder } from "@/lib/slices/orderDetailSlice";

// --- API hívások importálása ---
import { countryData } from "@/app/[locale]/checkout/data/country.data";
import { countyData } from "@/app/[locale]/checkout/data/county.data";
import { createNewOrder, requestPaymentUrl } from "@/api/orders";
import {
  checkUserExistsByEmail,
  getMainAddressesOfCurrentUser,
  loginCustomer,
} from "@/api/customers";
import { Button } from "@headlessui/react";
import { CourierPrice } from "@/models/courier-price.model";
import { getCourierPrice } from "@/api/company";
import { useCurrency } from "@/components/app/CurrencyProvider";
import { Link } from "@/i18n/routing";

// --- Fő komponens ---
const SimplifiedCheckoutFormWithShipping: FC = () => {
  const t = useTranslations("Pages.Checkout");
  const tAddress = useTranslations("Pages.Checkout.Address");
  const tSummary = useTranslations("Pages.Checkout.Summary");
  const tValidation = useTranslations("Pages.Checkout.Validation");
  const tAuth = useTranslations("Pages.Checkout.Auth");

  // --- Hook-ok inicializálása ---
  const cart: CartItem[] = useSelector((state: RootState) => state.cart) || [];
  const currency = useCurrency();
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();

  // --- Kezdeti üres állapotok ---
  const BLANK_BILLING_ADDRESS: BillingAddressDto = {
    address: "",
    edited: false,
    companyName: "",
    companyTaxId: "",
    cnp: "",
    registryCode: "",
    country: tAddress("defaultCountry") || "Romania",
    city: "",
    zip: "",
    county: "",
    street: "",
    number: "",
    block: "",
    apartment: "",
  };
  const BLANK_SHIPPING_ADDRESS: ShippingAddressDto = {
    edited: false,
    country: tAddress("defaultCountry") || "Romania",
    city: "",
    zip: "",
    county: "",
    street: "",
    number: "",
    block: "",
    apartment: "",
  };

  // --- State a teljes űrlaphoz ---
  const [isClient, setIsClient] = useState(false);
  const [rootUrl, setRootUrl] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", // This will be used for NEW account creation
  });
  const [billingDetails, setBillingDetails] = useState<BillingAddressDto>(
    BLANK_BILLING_ADDRESS,
  );
  const [shippingDetails, setShippingDetails] = useState<ShippingAddressDto>(
    BLANK_SHIPPING_ADDRESS,
  );
  const [billingType, setBillingType] = useState<"Independent" | "Company">(
    "Independent",
  );
  const [shippingIsSameAsBilling, setShippingIsSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courierPrice, setCourierPrice] = useState<CourierPrice>();

  // --- State for authentication flow ---
  const [wantsToCreateAccount, setWantsToCreateAccount] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [loginPassword, setLoginPassword] = useState(""); // For EXISTING user login attempt
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  );

  const prefillAddresses = () => {
    getMainAddressesOfCurrentUser()
      .then((addresses) => {
        if (addresses && addresses.length > 0) {
          // Assuming the first address is the main one
          const mainAddress: CustomerAddressDto = addresses[0];
          setShippingDetails(mainAddress.shippingAddress);
          setBillingDetails(mainAddress.billingAddress);
        }
      })
      .catch((err) => console.error("Failed to fetch addresses", err));
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      let domain = window.location.hostname.replace(/www\.|[^a-zA-Z0-9]/g, "");
      if (domain.includes("localhost")) {
        domain = "homesyncro"; // Mock domain for local development
      }
      setRootUrl(`https://${domain}.s3.eu-west-1.amazonaws.com/products/`);
    }
  }, []);

  useEffect(() => {
    const fetchCourierPrice = async () => {
      const constCourierPrice: CourierPrice = await getCourierPrice();
      setCourierPrice(constCourierPrice);
    };
    fetchCourierPrice();
  }, []);

  // Effect to check for existing user session on component mount
  useEffect(() => {
    const currentUserCookie = Cookies.get("currentUser");
    const authCookie = Cookies.get("auth");

    if (currentUserCookie && authCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      setContactInfo({
        name: parsedUser.name,
        email: parsedUser.email,
        phone: parsedUser.phone || "",
        password: "",
      });
      setCurrentUserId(parsedUser.id);
      setIsLoggedIn(true);
      prefillAddresses();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || cart.length === 0) return;

    const items = cart.map((item) => ({
      item_id: item.id.toString(),
      item_name: item.name,
      item_brand: item.brand,
      sku: item.sku || "-",
      item_category: item.categories,
      stock: item.stock,
      image: item.image,
      url: rootUrl + JSON.parse(item.link).query,
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
  }, [cart, currency.code]);

  const handleWantsToCreateAccountChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = e.target.checked;
    setWantsToCreateAccount(isChecked);
    setUserExists(null); // Reset previous state

    if (isChecked) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contactInfo.email || !emailRegex.test(contactInfo.email)) {
        setErrors((prev) => ({ ...prev, email: tValidation("invalidEmail") }));
        setWantsToCreateAccount(false);
        return;
      }

      setIsCheckingEmail(true);
      try {
        const exists = await checkUserExistsByEmail(contactInfo.email);
        setUserExists(exists);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: tAuth("emailCheckErrorTitle"),
          text: tAuth("emailCheckErrorMessage"),
        });
        setWantsToCreateAccount(false);
      } finally {
        setIsCheckingEmail(false);
      }
    }
  };

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!loginPassword) {
      setErrors((prev) => ({
        ...prev,
        loginPassword: tValidation("required"),
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await loginCustomer({
        email: contactInfo.email,
        password: loginPassword,
      });

      setContactInfo({
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone || "",
        password: "",
      });
      setCurrentUserId(loggedInUser.id);
      setIsLoggedIn(true);
      setWantsToCreateAccount(false);
      setUserExists(null);

      prefillAddresses();

      Swal.fire({
        icon: "success",
        title: tAuth("loginSuccessTitle"),
        text: tAuth("loginSuccessMessage"),
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: tAuth("loginErrorTitle"),
        text: tAuth("loginErrorMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    clearError(name);
    setContactInfo((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setWantsToCreateAccount(false);
      setUserExists(null);
    }
  };

  const handleBillingChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      clearError(name);
      setBillingDetails((prev) => {
        const newState = { ...prev, [name]: value };
        if (name === "country" && value !== "Romania") newState.county = "";
        if (shippingIsSameAsBilling) {
          setShippingDetails((current) => ({
            ...current,
            [name]: value,
            edited: false,
          }));
        }
        return newState;
      });
    },
    [shippingIsSameAsBilling, errors],
  );

  const handleShippingChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    clearError(`shipping_${name}`);
    setShippingDetails((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "country" && value !== "Romania") newState.county = "";
      return newState;
    });
  };

  const handleShippingSameAsBillingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = e.target.checked;
    setShippingIsSameAsBilling(isChecked);
    if (isChecked) {
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("shipping_")) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
      setShippingDetails({
        edited: false,
        country: billingDetails.country,
        city: billingDetails.city,
        zip: billingDetails.zip,
        county: billingDetails.county ?? "",
        street: billingDetails.street,
        number: billingDetails.number,
        block: billingDetails.block,
        apartment: billingDetails.apartment,
      });
    } else {
      setShippingDetails(BLANK_SHIPPING_ADDRESS);
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const formatPrice = (value: number) => {
    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Contact
    if (!contactInfo.name.trim()) newErrors.name = tValidation("required");
    if (!contactInfo.email.trim()) newErrors.email = tValidation("required");
    else if (!emailRegex.test(contactInfo.email))
      newErrors.email = tValidation("invalidEmail");
    if (!contactInfo.phone.trim()) newErrors.phone = tValidation("required");

    // Validate password creation if applicable
    if (wantsToCreateAccount && userExists === false) {
      if (!contactInfo.password) {
        newErrors.password = tValidation("required");
      } else if (contactInfo.password.length < 6) {
        newErrors.password = tValidation("passwordMinLength");
      }
    }

    // Billing
    if (!billingDetails.city.trim()) newErrors.city = tValidation("required");
    if (!billingDetails.street.trim())
      newErrors.street = tValidation("required");
    if (!billingDetails.number.trim())
      newErrors.number = tValidation("required");
    if (!billingDetails.zip.trim()) newErrors.zip = tValidation("required");
    if (tAddress("county") !== "" && !billingDetails.county?.trim())
      newErrors.county = tValidation("required");
    if (tAddress("country") !== "" && !billingDetails.country?.trim())
      newErrors.country = tValidation("required");

    if (billingType === "Company") {
      if (!billingDetails.companyName?.trim())
        newErrors.companyName = tValidation("required");
      if (!billingDetails.companyTaxId?.trim())
        newErrors.companyTaxId = tValidation("required");
    }

    // Shipping
    if (!shippingIsSameAsBilling) {
      if (!shippingDetails.city.trim())
        newErrors.shipping_city = tValidation("required");
      if (!shippingDetails.street.trim())
        newErrors.shipping_street = tValidation("required");
      if (!shippingDetails.number.trim())
        newErrors.shipping_number = tValidation("required");
      if (!shippingDetails.zip.trim())
        newErrors.shipping_zip = tValidation("required");
      if (tAddress("county") !== "" && !shippingDetails.county?.trim())
        newErrors.shipping_county = tValidation("required");
      if (tAddress("country") !== "" && !shippingDetails.country?.trim())
        newErrors.shipping_country = tValidation("required");
    }

    if (!paymentMethod)
      newErrors.paymentMethod = tValidation("paymentMethodRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid || !acceptTerms) {
      if (!acceptTerms && isValid) {
        Swal.fire({
          icon: "error",
          title: tValidation("error"),
          text: tValidation("termsRequired"),
        });
      }
      return;
    }
    setIsSubmitting(true);

    try {
      const isRegistering =
        wantsToCreateAccount && userExists === false && !isLoggedIn;

      const customerData: UserResponseDto = {
        id: isLoggedIn ? currentUserId : undefined,
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        password: isRegistering ? contactInfo.password : undefined,
        role: Role.CUSTOMER,
        active: true,
      };

      const finalShippingDetails: ShippingAddressDto = shippingIsSameAsBilling
        ? {
            country: billingDetails.country,
            city: billingDetails.city,
            zip: billingDetails.zip,
            county: billingDetails.county ?? "",
            street: billingDetails.street,
            number: billingDetails.number,
            block: billingDetails.block,
            apartment: billingDetails.apartment,
            edited: false,
          }
        : shippingDetails;

      const customerAddressData: CustomerAddressDto = {
        billingType:
          billingType === "Company"
            ? BillingType.COMPANY
            : BillingType.INDIVIDUAL,
        billingAddress: billingDetails,
        shippingAddress: finalShippingDetails,
        main: true,
      };

      const orderItems: OrderItemDto[] = cart.map((item) => ({
        productOption: {
          id: item.id,
          product: { vat: item.tvaPercent },
        } as ProductOptionDto,
        quantity: item.quantity,
        discount: item.discount,
        price: item.price,
      }));

      const order: NewOrderDto = {
        customer: customerData,
        customerAddress: customerAddressData,
        orderItems,
        paymentType: paymentMethod!,
        lang: locale,
        observation: "",
      };

      const createdOrder: OrderDto = await createNewOrder(order);

      if (typeof window !== "undefined") {
        const items = cart.map((item) => ({
          item_id: item.id.toString(),
          item_name: item.name,
          item_brand: item.brand,
          item_category: item.categories,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          sku: item.sku || "-",
        }));

        const totalDiscountPrices = cart.reduce(
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
            transaction_id: createdOrder.transactionId,
            value: totalDiscountPrices + (shippingCost || 0),
            currency: currency.code,
            shipping: shippingCost || 0,
            items,
          },
        });
      }

      if (createdOrder.paymentType === PaymentType.CARD_PAYMENT) {
        dispatch(clearCart());
        dispatch(clearOrder());
        if (createdOrder.id) {
          const paymentLink = await requestPaymentUrl(createdOrder.id);
          if (paymentLink) {
            window.location.href = paymentLink;
          } else {
            throw new Error("Payment URL could not be retrieved.");
          }
        }
      } else {
        dispatch(clearCart());
        dispatch(clearOrder());
        const confirmationLink: string = `/confirmation/${createdOrder.transactionId}`;
        router.replace(confirmationLink as Route);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      Swal.fire({
        icon: "error",
        title: tSummary("errors.genericTitle"),
        text: tSummary("errors.genericMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const subtotal = cart.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  function convertPaymentType(type: PaymentType | undefined): string {
    if (type) {
      switch (type) {
        case PaymentType.CASH_ON_DELIVERY:
          return t("Payment.cashOnDelivery");
        case PaymentType.CARD_PAYMENT:
          return t("Payment.card");
        case PaymentType.TRANSFER:
          return t("Payment.transfer");
        case PaymentType.NONE:
          return "";
        default:
          return "";
      }
    } else {
      return "";
    }
  }

  const getErrorClass = (fieldName: string) =>
    errors[fieldName]
      ? "border-red-500 focus:border-red-500"
      : "border-gray-200";

  return (
    <div className="container py-16 lg:pb-28 lg:pt-20">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-12 text-menu-text-light text flex ">
        <span className="uppercase tracking-tight">{t("title")}</span>
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col lg:flex-row gap-16 "
      >
        <div className="flex-1 space-y-10 rounded-md border">
          <section className="px-6 py-7 space-y-6 ">
            <h3 className=" text-menu-text-light text-xl font-semibold text flex ">
              <span className="uppercase tracking-tight">
                {t("ContactInfo.title")}
              </span>
            </h3>
            <div>
              <Label htmlFor="name">{t("ContactInfo.fullName")}</Label>
              <Input
                id="name"
                name="name"
                value={contactInfo.name}
                placeholder={t("ContactInfo.fullName")}
                onChange={handleContactChange}
                required
                className={getErrorClass("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">{t("ContactInfo.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={contactInfo.email}
                onChange={handleContactChange}
                required
                placeholder={t("ContactInfo.email")}
                className={getErrorClass("email")}
                disabled={isLoggedIn}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">{t("ContactInfo.phone")}</Label>
              <Input
                id="phone"
                name="phone"
                placeholder={t("ContactInfo.phone")}
                type="tel"
                value={contactInfo.phone}
                onChange={handleContactChange}
                required
                className={getErrorClass("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
            {!isLoggedIn && t("ContactInfo.saveAddress") !== "" && (
              <div className="flex items-center space-x-2">
                <input
                  id="create-account"
                  type="checkbox"
                  checked={wantsToCreateAccount}
                  onChange={handleWantsToCreateAccountChange}
                  className="text-primary-800 focus:ring-black h-6 w-6 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <Label htmlFor="create-account">
                  {t("ContactInfo.saveAddress")}
                </Label>
              </div>
            )}

            {isCheckingEmail && <p>{tAuth("checkingEmail")}</p>}

            {/* --- SHOW LOGIN FORM IF USER EXISTS --- */}
            {wantsToCreateAccount && userExists === true && !isLoggedIn && (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-4">
                <p className="text-sm text-blue-800">
                  {tAuth("accountExists")}
                </p>
                <div>
                  <Label htmlFor="loginPassword">{tAuth("password")}</Label>
                  <Input
                    id="loginPassword"
                    name="loginPassword"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      clearError("loginPassword");
                    }}
                    className={getErrorClass("loginPassword")}
                  />
                  {errors.loginPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.loginPassword}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleLogin}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? tAuth("loggingIn") : tAuth("login")}
                </Button>
              </div>
            )}

            {/* --- SHOW REGISTRATION FORM IF USER DOES NOT EXIST --- */}
            {wantsToCreateAccount && userExists === false && !isLoggedIn && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg space-y-4">
                <p className="text-sm text-green-800">
                  {tAuth("createAnAccount")}
                </p>
                <div>
                  <Label htmlFor="password">
                    {t("ContactInfo.setPassword")}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={contactInfo.password}
                    onChange={handleContactChange}
                    className={getErrorClass("password")}
                    placeholder={t("ContactInfo.password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="px-6 py-7 space-y-6 ">
            <h3 className=" text-menu-text-light text-xl font-semibold text flex ">
              <span className="uppercase tracking-tight">
                {tAddress("billing")}
              </span>
            </h3>
            <BillingAddressForm
              errors={errors}
              getErrorClass={getErrorClass}
              billingType={billingType}
              orderBillingDetail={billingDetails}
              handleChange={handleBillingChange}
              handleBillingTypeChange={setBillingType}
              country={billingDetails.country}
              handleCountryChange={handleBillingChange}
              isRomania={billingDetails.country === "Romania"}
              selectedCounty={billingDetails.county || ""}
              handleCountyChangeSelect={handleBillingChange}
              handleCountyChangeInput={handleBillingChange}
              localCountryData={countryData}
              localCountyData={countyData}
            />

            <h3 className=" text-menu-text-light text-xl font-semibold text flex ">
              <span className="uppercase tracking-tight">
                {tAddress("shipping")}
              </span>
            </h3>
            <div className="flex items-center">
              <input
                id="shipping-is-same"
                type="checkbox"
                checked={shippingIsSameAsBilling}
                onChange={handleShippingSameAsBillingChange}
                className="text-primary-800 focus:ring-black h-6 w-6 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
              />
              <Label htmlFor="shipping-is-same" className="ml-2 text-sm">
                {tAddress("shippingIsSameAsBilling")}
              </Label>
            </div>
            {!shippingIsSameAsBilling && (
              <div className="border-t pt-4 mt-4">
                <ShippingAddressForm
                  errors={errors}
                  getErrorClass={getErrorClass}
                  orderShippingDetail={shippingDetails}
                  handleShippingChange={handleShippingChange}
                  shippingCountry={shippingDetails.country}
                  handleShippingCountryChange={handleShippingChange}
                  shippingIsRomania={shippingDetails.country === "Romania"}
                  selectedShippingCounty={shippingDetails.county || ""}
                  handleShippingCountyChangeSelect={handleShippingChange}
                  handleShippingCountyChangeInput={handleShippingChange}
                  localCountryData={countryData}
                  localCountyData={countyData}
                />
              </div>
            )}
          </section>

          <section className="px-6 py-7 space-y-6 ">
            <h3 className=" text-menu-text-light text-xl font-semibold text flex ">
              <span className="uppercase tracking-tight">
                {t("Payment.title")}
              </span>
            </h3>
            <div
              className={`p-2 text-menu-text-light space-y-6  ${getErrorClass("paymentMethod")}`}
            >
              {t("Payment.card") !== "" && (
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <Radio
                    key={`payment-card-${paymentMethod}`}
                    id="card"
                    className="pt-3.5"
                    name="payment-method"
                    defaultChecked={paymentMethod === PaymentType.CARD_PAYMENT}
                    onChange={() => {
                      clearError("paymentMethod");
                      setPaymentMethod(PaymentType.CARD_PAYMENT);
                    }}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={PaymentType.CARD_PAYMENT}
                      className="flex items-center space-x-4 sm:space-x-6 cursor-pointer"
                    >
                      <div
                        className={`p-2.5 rounded-xl border-2 ${
                          paymentMethod === PaymentType.CARD_PAYMENT
                            ? "border-accent-600 dark:border-accent-300"
                            : "border-gray-200 dark:border-accent-600"
                        }`}
                      >
                        <svg
                          className="w-6 h-6 sm:w-7 sm:h-7"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M2 12.6101H19"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 10.28V17.43C18.97 20.28 18.19 21 15.22 21H5.78003C2.76003 21 2 20.2501 2 17.2701V10.28C2 7.58005 2.63 6.71005 5 6.57005C5.24 6.56005 5.50003 6.55005 5.78003 6.55005H15.22C18.24 6.55005 19 7.30005 19 10.28Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22 6.73V13.72C22 16.42 21.37 17.29 19 17.43V10.28C19 7.3 18.24 6.55 15.22 6.55H5.78003C5.50003 6.55 5.24 6.56 5 6.57C5.03 3.72 5.81003 3 8.78003 3H18.22C21.24 3 22 3.75 22 6.73Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.25 17.8101H6.96997"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.10986 17.8101H12.5499"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="font-medium">
                        {convertPaymentType(PaymentType.CARD_PAYMENT)}
                      </p>
                    </label>
                  </div>
                </div>
              )}
              <div className="flex items-start space-x-4 sm:space-x-6">
                <Radio
                  key={`payment-cash-${paymentMethod}`}
                  id="cashOnDelivery"
                  className="pt-3.5"
                  name="payment-method"
                  defaultChecked={
                    paymentMethod === PaymentType.CASH_ON_DELIVERY
                  }
                  onChange={() => {
                    clearError("paymentMethod");
                    setPaymentMethod(PaymentType.CASH_ON_DELIVERY);
                  }}
                />
                <div className="flex-1">
                  <label
                    htmlFor={PaymentType.CASH_ON_DELIVERY}
                    className="flex items-center space-x-4 sm:space-x-6 "
                  >
                    <div
                      className={`p-2.5 rounded-xl border-2 ${
                        paymentMethod === PaymentType.CASH_ON_DELIVERY
                          ? "border-accent-600 dark:border-accent-300"
                          : "border-gray-200 dark:border-accent-600"
                      }`}
                    >
                      <svg
                        className="w-6 h-6 sm:w-7 sm:h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 12H14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-medium">
                      {convertPaymentType(PaymentType.CASH_ON_DELIVERY)}
                    </p>
                  </label>
                </div>
              </div>
              {t("Payment.transfer") !== "" && (
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <Radio
                    key={`payment-transfer-${paymentMethod}`}
                    id="transfer"
                    className="pt-3.5"
                    name="payment-method"
                    defaultChecked={paymentMethod === PaymentType.TRANSFER}
                    onChange={() => {
                      clearError("paymentMethod");
                      setPaymentMethod(PaymentType.TRANSFER);
                    }}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={PaymentType.TRANSFER}
                      className="flex items-center space-x-4 sm:space-x-6 "
                    >
                      <div
                        className={`p-2.5 rounded-xl border-2 ${
                          paymentMethod === PaymentType.TRANSFER
                            ? "border-accent-600 dark:border-accent-300"
                            : "border-gray-200 dark:border-accent-600"
                        }`}
                      >
                        <svg
                          className="w-6 h-6 sm:w-7 sm:h-7"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 12H14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <p className="font-medium">
                        {convertPaymentType(PaymentType.TRANSFER)}
                      </p>
                    </label>
                  </div>
                </div>
              )}
            </div>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500 mt-1">
                {errors.paymentMethod}
              </p>
            )}
          </section>
        </div>

        <div className="w-full lg:w-[36%]">
          <h3 className="text-lg font-semibold text-menu-text-light">
            {t("Summary.title")}
          </h3>
          <div className="mt-8 divide-y divide-gray-200">
            {isClient &&
              cart.map((item) => (
                <div key={item.id} className="flex py-4 items-center">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={rootUrl + item.image}
                      alt={item.name}
                      layout="fill"
                      objectFit="contain"
                      className="p-1"
                    />
                    <Link
                      className="absolute inset-0"
                      href={JSON.parse(item.link) as Route}
                    ></Link>
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <h4 className="font-medium text-base text-menu-text-light">
                      <Link href={JSON.parse(item.link) as Route}>
                        {item.name}
                      </Link>
                    </h4>

                    <div className="flex justify-between items-center mt-3">
                      <NcInputNumber
                        className="relative z-10 text-menu-text-light"
                        defaultValue={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.id, value)
                        }
                        max={item.currentStock}
                        min={0}
                      />
                      <Prices
                        price={item.price}
                        discountPrice={item.discountPrice}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {isClient && cart.length === 0 && (
              <p className="text-sm text-primary-500 py-4">
                {tValidation("cartIsEmpty")}
              </p>
            )}
          </div>
          <div className="flex justify-between font-semibold text-base pt-4 mt-4 border-t text-menu-text-light">
            <span>{t("Summary.subtotal")}</span>

            <span>
              {isClient ? subtotal.toFixed(2) : "0.00"} {currency.symbol}
            </span>
          </div>
          <div className="border-gray-200 text-sm">
            {courierPrice && (
              <div className="flex justify-between font-semibold text-base pt-4 mt-4 border-t text-menu-text-light">
                <span>{tSummary("transport")}</span>
                <span className="font-semibold text-menu-text-light dark:text-accent-200">
                  <span>
                    {courierPrice.defaultExpectedCourierMin > subtotal
                      ? formatPrice(courierPrice.defaultExpectedCourierPrice)
                      : 0.0}{" "}
                    {currency.symbol}
                  </span>
                </span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base pt-4 mt-4 border-t text-menu-text-light">
              <span>{t("Summary.total")}</span>

              <span>
                {isClient &&
                  formatPrice(
                    subtotal +
                      (courierPrice?.defaultExpectedCourierPrice &&
                      subtotal < courierPrice.defaultExpectedCourierMin
                        ? courierPrice?.defaultExpectedCourierPrice
                        : 0),
                  )}{" "}
                {currency.symbol}
                {/*{isClient ? subtotal.toFixed(2) : "0.00"} {currency.symbol}*/}
              </span>
            </div>
          </div>
          <div className="mt-8">
            <TermsCheckbox
              id="simplified-terms"
              checked={acceptTerms}
              onChange={setAcceptTerms}
              name="simplified-terms"
            />
            <ButtonPrimary
              type="submit"
              className="w-full mt-5"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("Summary.confirm") + "..."
                : t("Summary.confirm")}
            </ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  );
};

interface AddressFormProps {
  errors: { [key: string]: string };
  getErrorClass: (fieldName: string) => string;
}

interface BillingAddressFormProps extends AddressFormProps {
  billingType: "Independent" | "Company";
  orderBillingDetail: BillingAddressDto;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBillingTypeChange: (type: "Independent" | "Company") => void;
  country: string;
  handleCountryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  isRomania: boolean;
  selectedCounty: string;
  handleCountyChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleCountyChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  errors,
  getErrorClass,
  billingType,
  orderBillingDetail,
  handleChange,
  handleBillingTypeChange,
  country,
  handleCountryChange,
  isRomania,
  selectedCounty,
  handleCountyChangeSelect,
  handleCountyChangeInput,
  localCountryData,
  localCountyData,
}) => {
  const t = useTranslations("Pages.Checkout.Address");
  return (
    <div className="space-y-4">
      <div>
        <Label>{t("billingType")}</Label>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          <Radio
            key={`independent-radio-${billingType}`}
            id="independent"
            label={t("independent")}
            name="billing-type"
            defaultChecked={billingType === "Independent"}
            onChange={() => handleBillingTypeChange("Independent")}
          />
          <Radio
            key={`company-radio-${billingType}`}
            id="company"
            label={t("company")}
            name="billing-type"
            defaultChecked={billingType === "Company"}
            onChange={() => handleBillingTypeChange("Company")}
          />
        </div>
      </div>
      {billingType === "Company" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">{t("company")}</Label>
            <Input
              id="companyName"
              name="companyName"
              value={orderBillingDetail.companyName || ""}
              onChange={handleChange}
              required
              className={getErrorClass("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="companyTaxId">{t("taxID")}</Label>
            <Input
              id="companyTaxId"
              name="companyTaxId"
              placeholder={t("taxID")}
              value={orderBillingDetail.companyTaxId || ""}
              onChange={handleChange}
              required
              className={getErrorClass("companyTaxId")}
            />
            {errors.companyTaxId && (
              <p className="text-sm text-red-500 mt-1">{errors.companyTaxId}</p>
            )}
          </div>
          {t("registryCode") !== "" && (
            <div>
              <Label htmlFor="registryCode">{t("registryCode")}</Label>
              <Input
                id="registryCode"
                name="registryCode"
                placeholder={t("registryCode")}
                value={orderBillingDetail.registryCode || ""}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      )}
      {billingType === "Independent" && t("cnp") !== "" && (
        <div>
          <Label htmlFor="cnp">{t("cnp")}</Label>
          <Input
            id="cnp"
            name="cnp"
            placeholder={t("cnp")}
            value={orderBillingDetail.cnp || ""}
            onChange={handleChange}
          />
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {t("country") !== "" && (
          <div>
            <Label htmlFor="country">{t("country")}</Label>
            <Select
              id="country"
              name="country"
              value={country}
              onChange={handleCountryChange}
              className={getErrorClass("country")}
            >
              {localCountryData.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500 mt-1">{errors.country}</p>
            )}
          </div>
        )}
        {t("county") !== "" &&
          (isRomania ? (
            <div>
              <Label htmlFor="county">{t("county")}</Label>
              <Select
                id="county"
                name="county"
                value={selectedCounty}
                onChange={handleCountyChangeSelect}
                required
                className={getErrorClass("county")}
              >
                <option value="">{t("selectCounty")}</option>
                {localCountyData.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {errors.county && (
                <p className="text-sm text-red-500 mt-1">{errors.county}</p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="county">{t("county")}</Label>
              <Input
                id="county"
                name="county"
                placeholder={t("county")}
                value={selectedCounty}
                onChange={handleCountyChangeInput}
                required
                className={getErrorClass("county")}
              />
              {errors.county && (
                <p className="text-sm text-red-500 mt-1">{errors.county}</p>
              )}
            </div>
          ))}
        <div>
          <Label htmlFor="city">{t("city")}</Label>
          <Input
            id="city"
            name="city"
            placeholder={t("city")}
            value={orderBillingDetail.city || ""}
            onChange={handleChange}
            required
            className={getErrorClass("city")}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="zip">{t("postalCode")}</Label>
          <Input
            id="zip"
            name="zip"
            value={orderBillingDetail.zip || ""}
            onChange={handleChange}
            placeholder={t("postalCode")}
            required
            className={getErrorClass("zip")}
          />
          {errors.zip && (
            <p className="text-sm text-red-500 mt-1">{errors.zip}</p>
          )}
        </div>
        <div>
          <Label htmlFor="street">{t("street")}</Label>
          <Input
            id="street"
            name="street"
            placeholder={t("street")}
            value={orderBillingDetail.street || ""}
            onChange={handleChange}
            required
            className={getErrorClass("street")}
          />
          {errors.street && (
            <p className="text-sm text-red-500 mt-1">{errors.street}</p>
          )}
        </div>
        <div>
          <Label htmlFor="number">{t("number")}</Label>
          <Input
            id="number"
            name="number"
            placeholder={t("number")}
            value={orderBillingDetail.number || ""}
            onChange={handleChange}
            required
            className={getErrorClass("number")}
          />
          {errors.number && (
            <p className="text-sm text-red-500 mt-1">{errors.number}</p>
          )}
        </div>
        <div>
          <Label htmlFor="block">{t("block")}</Label>
          <Input
            id="block"
            placeholder={t("block")}
            name="block"
            value={orderBillingDetail.block || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="apartment">{t("apartment")}</Label>
          <Input
            id="apartment"
            name="apartment"
            placeholder={t("apartment")}
            value={orderBillingDetail.apartment || ""}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

interface ShippingAddressFormProps extends AddressFormProps {
  orderShippingDetail: ShippingAddressDto;
  handleShippingChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  shippingCountry: string;
  handleShippingCountryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  shippingIsRomania: boolean;
  selectedShippingCounty: string;
  handleShippingCountyChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleShippingCountyChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  localCountryData: string[];
  localCountyData: string[];
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  errors,
  getErrorClass,
  orderShippingDetail,
  handleShippingChange,
  shippingCountry,
  handleShippingCountryChange,
  shippingIsRomania,
  selectedShippingCounty,
  handleShippingCountyChangeSelect,
  handleShippingCountyChangeInput,
  localCountryData,
  localCountyData,
}) => {
  const t = useTranslations("Pages.Checkout.Address");
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {t("country") !== "" && (
          <div>
            <Label htmlFor="shipping_country">{t("country")}</Label>
            <Select
              id="shipping_country"
              name="country"
              value={shippingCountry}
              onChange={handleShippingCountryChange}
              className={getErrorClass("shipping_country")}
            >
              {localCountryData.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            {errors.shipping_country && (
              <p className="text-sm text-red-500 mt-1">
                {errors.shipping_country}
              </p>
            )}
          </div>
        )}
        {t("county") !== "" &&
          (shippingIsRomania ? (
            <div>
              <Label htmlFor="shipping_county">{t("county")}</Label>
              <Select
                id="shipping_county"
                name="county"
                value={selectedShippingCounty}
                onChange={handleShippingCountyChangeSelect}
                required
                className={getErrorClass("shipping_county")}
              >
                <option value="">{t("selectCounty")}</option>
                {localCountyData.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {errors.shipping_county && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.shipping_county}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="shipping_county">{t("county")}</Label>
              <Input
                id="shipping_county"
                name="county"
                placeholder={t("county")}
                value={selectedShippingCounty}
                onChange={handleShippingCountyChangeInput}
                required
                className={getErrorClass("shipping_county")}
              />
              {errors.shipping_county && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.shipping_county}
                </p>
              )}
            </div>
          ))}
        <div>
          <Label htmlFor="shipping_city">{t("city")}</Label>
          <Input
            id="shipping_city"
            name="city"
            placeholder={t("city")}
            value={orderShippingDetail.city || ""}
            onChange={handleShippingChange}
            required
            className={getErrorClass("shipping_city")}
          />
          {errors.shipping_city && (
            <p className="text-sm text-red-500 mt-1">{errors.shipping_city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="shipping_zip">{t("postalCode")}</Label>
          <Input
            id="shipping_zip"
            name="zip"
            placeholder={t("zip")}
            value={orderShippingDetail.zip || ""}
            onChange={handleShippingChange}
            required
            className={getErrorClass("shipping_zip")}
          />
          {errors.shipping_zip && (
            <p className="text-sm text-red-500 mt-1">{errors.shipping_zip}</p>
          )}
        </div>
        <div>
          <Label htmlFor="shipping_street">{t("street")}</Label>
          <Input
            id="shipping_street"
            name="street"
            placeholder={t("street")}
            value={orderShippingDetail.street || ""}
            onChange={handleShippingChange}
            required
            className={getErrorClass("shipping_street")}
          />
          {errors.shipping_street && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shipping_street}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="shipping_number">{t("number")}</Label>
          <Input
            id="shipping_number"
            name="number"
            placeholder={t("number")}
            value={orderShippingDetail.number || ""}
            onChange={handleShippingChange}
            required
            className={getErrorClass("shipping_number")}
          />
          {errors.shipping_number && (
            <p className="text-sm text-red-500 mt-1">
              {errors.shipping_number}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="shipping_block">{t("block")}</Label>
          <Input
            id="shipping_block"
            name="block"
            placeholder={t("block")}
            value={orderShippingDetail.block || ""}
            onChange={handleShippingChange}
          />
        </div>
        <div>
          <Label htmlFor="shipping_apartment">{t("apartment")}</Label>
          <Input
            id="shipping_apartment"
            name="apartment"
            placeholder={t("apartment")}
            value={orderShippingDetail.apartment || ""}
            onChange={handleShippingChange}
          />
        </div>
      </div>
    </div>
  );
};
export default SimplifiedCheckoutFormWithShipping;
