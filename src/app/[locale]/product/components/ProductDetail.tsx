"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ShortProductOptionDetailDto, Status } from "@/models/product.model";
import { ProductFilterDto, VariantType } from "@/models/filter.model";
import { useSearchParams } from "next/navigation";
// HIGHLIGHT: Added XMarkIcon
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import NcInputNumber from "@/components/ui/NcInputNumber/NcInputNumber";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import BagIcon from "@/components/icons/BagIcon";
import ReviewItem from "@/components/layout/ReviewItem/ReviewItem";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "@/models/cart-item.model";
import { addOrUpdateCart } from "@/lib/slices/cartSlice";
import { UrlObject } from "node:url";
import NotifyAddToCart from "@/components/ui/NotifyAddToCart/NotifyAddToCart";
import Policy from "@/app/[locale]/product/components/Policy";
import ModalViewAllReviews from "@/app/[locale]/product/components/ModalViewAllReviews";
import { RootState } from "@/lib/store";
import { ReviewDto } from "@/models/review.model";
import NewReview from "@/app/[locale]/product/components/NewReview";
import { useTranslations } from "next-intl";
import SimilarProductsCarousel from "@/components/layout/FeaturedProducts/SimilarProducts";
import ProductPriceDetail from "./ProductPriceDetail";
import { useCurrency } from "@/components/app/CurrencyProvider";
import NewContactToOrder from "@/app/[locale]/product/components/NewContactToOrder";
import { CustomSwiper } from "@/components/layout/CustomSwiper/CustomSwiper";
import { filterProductOptions } from "@/api/products";
import CompatibleProductsCarousel from "@/components/layout/FeaturedProducts/CompatibleProducts";

const ProductDetail = ({ s }: { s: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Get filter from search params
  const getFilterFromSearchParams = (): ProductFilterDto => {
    const variants =
      searchParams
        .get("variant")
        ?.split(",")
        .map(Number)
        .filter((num) => !isNaN(num)) || [];

    const productId = parseInt(searchParams.get("id") || "", 10) || 0;
    const productSlug: string = s;

    if (productId == 0) {
      return {
        visibility: true,
        active: true,
        productSlug: productSlug,
        perPage: 1,
        variants,
      };
    }
    return {
      visibility: true,
      active: true,
      productId: productId,
      perPage: 1,
      variants,
    };
  };

  const cart = useSelector((state: RootState) => state.cart) || [];

  const [quantitySelected, setQuantitySelected] = useState(1);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);
  const [isOpenModalNewReview, setIsOpenModalNewReview] = useState(false);
  const [isOpenModalNewContactToOrder, setIsOpenModalNewContactToOrder] =
    useState(false);

  const [rootUrl, setRootUrl] = useState("");
  const [product, setProducts] = useState<ShortProductOptionDetailDto>();
  const [googleMerchant, setGoogleMerchant] = useState<any>();
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [variantTypes, setVariantTypes] = useState<VariantType[]>();
  const [loading, setLoading] = useState(true);
  const [cartItem, setCartItem] = useState<CartItem>();
  const [status, setStatus] = useState<string>("");
  const [maxNum, setMaxNum] = useState<number>();
  const initialFilter = useMemo(() => getFilterFromSearchParams(), []);
  const [filter, setFilter] = useState<ProductFilterDto>(initialFilter);
  const [validCombinations, setValidCombinations] = useState<number[][]>([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);

  const t = useTranslations("Pages.Products.Reviews");
  const tContactToOrder = useTranslations("Pages.Products.ContactToOrder");
  const tProduct = useTranslations("Pages.Products");
  const tHeader = useTranslations("Header");
  const currency = useCurrency();

  const handleCloseNotification = () => {
    setNotificationVisible(false);
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
    if (!googleMerchant) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(googleMerchant);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [googleMerchant]);

  useEffect(() => {
    if (rootUrl !== "" && !product) {
      window.scrollTo({ top: 0, left: 0 });
      setLoading(false);
    }
  }, [rootUrl, product]);

  const fetchProducts = async (filter: ProductFilterDto) => {
    try {
      const loadingTimer = setTimeout(() => setLoading(true), 100);

      const result = await filterProductOptions(filter);

      clearTimeout(loadingTimer);

      setProducts(result.product);
      setReviews(result.reviews);
      setGoogleMerchant(result.googleMerchant);
      setValidCombinations(result.validCombinations || []);

      if (variantTypes !== result.filter.variantTypes) {
        setVariantTypes(result.filter.variantTypes);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          currency: googleMerchant?.offers?.priceCurrency || currency.symbol,
          items: [
            {
              item_id: product.productId,
              sku: product.sku,
              item_name: googleMerchant.name,
              price: googleMerchant.offers?.price || product.sellPrice,
              stock: product.stock,
              item_brand: googleMerchant.brand.name || "Unknown Brand",
              item_category: googleMerchant?.category || "Uncategorized",
              item_variant:
                product.variants
                  ?.map((variant) => variant.variantValue.value)
                  .join(", ") || "Default",
              quantity: 1,
              image_url: googleMerchant?.image || "",
              product_url: googleMerchant?.offers?.url,
            },
          ],
        },
      });
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    if (product.stock <= 0) {
      setStatus(Status.SOLD_OUT);
      setMaxNum(0);
      return;
    }

    const itemInCart = cart?.find((item) => item.id === product.id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;
    const availableStockToAdd = product.stock - quantityInCart;

    if (availableStockToAdd <= 0) {
      setStatus(Status.SOLD_OUT);
      setMaxNum(0);
    } else {
      setStatus("");
      setMaxNum(availableStockToAdd);
    }
  }, [product, cart]);

  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");
    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  useEffect(() => {
    const newFilter = getFilterFromSearchParams();
    if (JSON.stringify(newFilter) !== JSON.stringify(filter)) {
      setFilter(newFilter);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProducts(filter);
  }, [filter]);

  const dispatch = useDispatch();

  // HIGHLIGHT: New function to clear a specific variant type
  const handleClearVariantType = (variantTypeToClear: VariantType) => {
    // 1. Get current URL params
    const currentSearchParams = new URLSearchParams(
      searchParams?.toString() || "",
    );

    // 2. Identify all IDs belonging to the type we want to clear
    const idsToRemove = variantTypeToClear.variants.map((v) => v.id);

    // 3. Filter the currently selected variants from the state/URL
    const currentVariantIds =
      searchParams
        .get("variant")
        ?.split(",")
        .map(Number)
        .filter((num) => !isNaN(num)) || [];

    const remainingVariants = currentVariantIds.filter(
      (id) => !idsToRemove.includes(id),
    );

    // 4. Update the params
    if (remainingVariants.length > 0) {
      currentSearchParams.set("variant", remainingVariants.join(","));
    } else {
      currentSearchParams.delete("variant");
    }

    // 5. Navigate
    const newPath = `${pathname}${
      currentSearchParams.toString() ? "?" + currentSearchParams.toString() : ""
    }`;
    window.location.assign(newPath);
  };

  const addToCart = () => {
    if (quantitySelected === 0) {
      return;
    }

    const currentSearchParams = new URLSearchParams(
      searchParams?.toString() || "",
    );

    const link: UrlObject = {
      pathname: pathname,
      query: currentSearchParams.toString(),
    };

    if (product) {
      let cartItem: CartItem = {
        id: product.id,
        name: product.name,
        brand: googleMerchant.brand.name || "Unknown Brand",
        categories: googleMerchant.category || "Uncategorized",
        image: product.images[0].image,
        link: JSON.stringify(link),
        price: product.sellPrice,
        discountPrice: product.discountPrice,
        tvaPercent: product.vat,
        quantity: quantitySelected,
        stock: product.stock,
        currentStock: product.stock - quantitySelected,
        sku: product.sku,
      };

      setCartItem(cartItem);

      const productData = {
        item_id: cartItem.id,
        item_name: cartItem.name,
        price: cartItem.price,
        stock: cartItem.stock,
        quantity: cartItem.quantity,
        image_url: cartItem.image,
        product_url: googleMerchant?.url,
        item_brand: googleMerchant?.brand.name || "Unknown Brand",
        item_category: googleMerchant?.category || "Uncategorized",
        sku: cartItem?.sku || "-",
      };

      if (productData && Object.keys(productData).length > 0) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });

        if (productData.item_id && productData.item_name && productData.price) {
          window.dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
              currency:
                googleMerchant?.offers?.priceCurrency || currency.symbol,
              add: {
                items: [productData],
              },
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (cartItem) {
      setNotificationVisible(true);
      const timer = setTimeout(() => {
        setNotificationVisible(false);
      }, 3000);

      dispatch(addOrUpdateCart(cartItem));
      setQuantitySelected(1);

      return () => clearTimeout(timer);
    }
  }, [cartItem, dispatch]);

  const updateFilterWithVariant = (variantId: number) => {
    if (!variantTypes || !Array.isArray(variantTypes)) return null;

    const variantType = variantTypes.find((type) =>
      type.variants.some((variant) => variant.id === variantId),
    );

    if (!variantType) {
      return { pathname: window.location.pathname, query: "" };
    }

    const currentVariants = (filter?.variants ?? []).filter(
      (vId) => !variantType.variants.some((variant) => variant.id === vId),
    );

    const updatedVariants = [...currentVariants, variantId];

    const newSearchParams = new URLSearchParams(searchParams?.toString() || "");
    newSearchParams.set("variant", updatedVariants.join(","));

    return {
      pathname: pathname,
      query: newSearchParams.toString(),
    };
  };

  const getVariantTypeForId = (
    variantId: number,
    variantTypes: VariantType[],
  ): VariantType | undefined => {
    return variantTypes.find((type) =>
      type.variants.some((v) => v.id === variantId),
    );
  };

  const isVariantValid = (
    checkingVariantId: number,
    variantTypes: VariantType[] | undefined,
    currentFilterVariants: number[] | undefined,
    allValidCombinations: number[][],
  ): boolean => {
    if (!variantTypes || !allValidCombinations.length) {
      return true;
    }

    const currentVariants = currentFilterVariants || [];
    const checkingVariantType = getVariantTypeForId(
      checkingVariantId,
      variantTypes,
    );

    if (!checkingVariantType) return true;

    const otherConstraints = currentVariants.filter((vId) => {
      const type = getVariantTypeForId(vId, variantTypes);
      return type && type.name !== checkingVariantType.name;
    });

    const hypotheticalConstraintSet = [...otherConstraints, checkingVariantId];

    if (otherConstraints.length === 0) {
      return allValidCombinations.some((combination) =>
        combination.includes(checkingVariantId),
      );
    }

    const sortedHypothetical = hypotheticalConstraintSet
      .slice()
      .sort((a, b) => a - b);
    const constraintSetString = sortedHypothetical.join(",");

    return allValidCombinations.some((combination) => {
      const sortedCombination = combination.slice().sort((a, b) => a - b);
      return sortedCombination.join(",") === constraintSetString;
    });
  };

  const renderVariants = () => {
    if (!variantTypes || !variantTypes.length) {
      return <></>;
    }

    const currentFilterVariants = filter?.variants ?? [];

    return (
      <div>
        {variantTypes.map((variantType, typeIndex) => {
          const hasImages = variantType.variants.some(
            (variant) => variant.image,
          );

          const selectedVariant = variantType.variants.find((variant) =>
            currentFilterVariants.includes(variant.id),
          );

          const isThisTypeActive = !!selectedVariant;

          return (
            <div key={typeIndex} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {variantType.name}:{" "}
                  <span className="font-semibold">
                    {selectedVariant ? selectedVariant.name : " "}
                  </span>
                </label>

                {isThisTypeActive && (
                  <button
                    onClick={() => handleClearVariantType(variantType)}
                    className="text-[15px] py-1 px-2 h-auto !min-w-0 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 mr-1 text-red-600" />
                  </button>
                )}
              </div>

              <div
                className={`grid ${
                  hasImages
                    ? "grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
                    : "grid-cols-4"
                } gap-2`}
              >
                {variantType.variants.map((variant, index) => {
                  const isSelected =
                    currentFilterVariants.includes(variant.id) ?? false;

                  const isValid = isVariantValid(
                    variant.id,
                    variantTypes,
                    currentFilterVariants,
                    validCombinations,
                  );

                  const isDisabled = !isValid && !isSelected;

                  const url = variant.image
                    ? `${rootUrl}variants/${encodeURIComponent(variant.image)}`
                    : "";

                  const filterUpdate = updateFilterWithVariant(variant.id);
                  const href = filterUpdate
                    ? {
                        pathname: filterUpdate.pathname,
                        search: filterUpdate.query,
                      }
                    : { pathname: pathname };

                  return (
                    <Link
                      href={isDisabled ? "#" : href}
                      key={`${typeIndex}-${index}`}
                      replace={true}
                      scroll={false}
                      prefetch={true}
                      className={`relative flex items-center justify-center p-0.5 border-2 transition-all duration-200 
                                      ${
                                        isSelected
                                          ? "border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800"
                                          : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                                      }
                                      ${hasImages ? "aspect-square rounded-full" : "min-w-[80px] rounded-lg"} 
                                      ${loading ? "opacity-50 pointer-events-none" : ""}
                                      ${isDisabled ? "opacity-30 cursor-not-allowed pointer-events-none notavailable" : ""}`}
                      title={
                        isDisabled
                          ? "Not available with current selections"
                          : variant.name
                      }
                    >
                      {variant.image ? (
                        <Image
                          src={url}
                          alt="variant"
                          className="h-full w-full object-cover rounded-full"
                          width={44}
                          height={44}
                        />
                      ) : (
                        <span className="text-sm font-medium px-3 py-1.5">
                          {variant.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-8 2xl:space-y-10">
        <div className="space-y-5">
          {!product?.name ? (
            <Skeleton count={2} height={35} />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-semibold text-menu-text-light dark:text-gray-100">
              {product?.name || <Skeleton width={300} />}
            </h1>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full">
                <StarIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="ml-1.5 font-medium text-primary-700 dark:text-primary-300">
                  {product?.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span
                className="text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => setIsOpenModalViewAllReviews(true)}
              >
                {reviews && reviews.length} {t("reviews")}
              </span>
            </div>

            {status === Status.SOLD_OUT && (
              <div className="inline-flex items-center bg-rose-100 dark:bg-rose-900 px-3 py-1 rounded-full">
                <SparklesIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="ml-1.5 text-sm font-medium text-rose-700 dark:text-rose-300">
                  {tProduct("soldOut")}
                </span>
              </div>
            )}
          </div>

          {product && <ProductPriceDetail product={product} />}

          {product?.shortDescription && (
            <div
              className="mt-2 text-sm text-menu-text-light dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          )}

          <div className="space-y-6">{renderVariants()}</div>
          <div className="space-y-6">
            <div className="flex flex-row sm:items-center gap-4 mt-6">
              <div className="flex-shrink-0 flex items-center justify-center bg-menu-bg-light px-3 py-2 rounded-full">
                <NcInputNumber
                  defaultValue={maxNum == 0 ? 0 : quantitySelected}
                  onChange={setQuantitySelected}
                  max={maxNum || 0}
                  min={0}
                  className="text-menu-text-light"
                />
              </div>
              {tContactToOrder("Available") === "TRUE" &&
              status === Status.SOLD_OUT ? (
                <ButtonPrimary
                  onClick={() => setIsOpenModalNewContactToOrder(true)}
                  className="flex-1"
                >
                  {tContactToOrder("contactToOrder")}
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  className="flex-1"
                  disabled={status === Status.SOLD_OUT}
                  onClick={addToCart}
                >
                  <BagIcon className="w-5 h-5" />
                  <span className="ml-2">{tHeader("addToCart")}</span>
                </ButtonPrimary>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailSection = () => {
    if (loading) return <Skeleton count={8} height={20} />;
    if (!product?.description) return null;
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-menu-text-light">
          {tHeader("details")}
        </h2>
        <div
          id="product-description"
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none [&_*]:text-menu-text-light"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold flex items-center">
          {reviews && reviews.length > 0 ? (
            <>
              <StarIcon className="w-7 h-7 mb-0.5" />
              <div className="ml-1.5 flex">
                <span>{product?.rating}</span>
                <span className="block mx-2">·</span>
                <span className="text-accent-200 underline">
                  {reviews && reviews.length}
                </span>
              </div>
            </>
          ) : (
            <div>
              <span className="text-menu-text-light">{t("noReviews")}</span>
              <span className="block text-sm text-menu-text-light mt-3">
                {t("leaveReview")}
              </span>
            </div>
          )}
        </h2>

        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            {reviews &&
              reviews.length > 0 &&
              reviews.slice(0, 4).map((review, index) => (
                <ReviewItem
                  key={index}
                  data={{
                    comment: review.review,
                    date: new Date(
                      review.createDate ?? new Date(),
                    ).toLocaleDateString("ro-RO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                    name: review.name,
                    starPoint: review.rating,
                  }}
                />
              ))}
          </div>

          {reviews && reviews.length > 0 && (
            <ButtonSecondary
              onClick={() => setIsOpenModalViewAllReviews(true)}
              className="mt-10 border border-accent-300 dark:border-accent-700 "
            >
              {t("seeAll")} {reviews.length}
            </ButtonSecondary>
          )}

          <ButtonSecondary
            onClick={() => setIsOpenModalNewReview(true)}
            className="ms-2 mt-10 border border-accent-300 dark:border-accent-700 "
          >
            {t("writeReview")}
          </ButtonSecondary>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        {product?.images?.[0]?.image && (
          <NotifyAddToCart
            name={product.name || ""}
            productImage={rootUrl + "products/" + product.images[0].image}
            show={isNotificationVisible}
            onClose={handleCloseNotification}
          />
        )}
      </div>

      <div className={`nc-ProductDetailPage `}>
        <main className="container mt-5 lg:mt-11">
          <div
            className={`lg:flex min-h-[350px] ${
              product?.images?.length === 1 ? "items-center" : ""
            }`}
          >
            <div
              className={`w-full lg:w-[50%] ${
                product?.images?.length === 1
                  ? "h-[300px] flex items-center"
                  : ""
              }`}
            >
              <CustomSwiper
                rootUrl={rootUrl + "products/"}
                images={product?.images}
              />
            </div>

            <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
              {renderSectionContent()}
            </div>
          </div>

          <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
            <div className="block">
              <Policy />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {renderDetailSection()}

            <hr className="border-gray-200 dark:border-gray-700" />

            {!loading && (
              <>
                <SimilarProductsCarousel queryParam={product?.productId} />
                <CompatibleProductsCarousel queryParam={product?.productId} />
              </>
            )}

            {renderReviews()}
          </div>
        </main>
        <ModalViewAllReviews
          show={isOpenModalViewAllReviews}
          reviews={reviews}
          rating={product?.rating ?? 0}
          onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
        />
        {product?.productId && (
          <NewReview
            show={isOpenModalNewReview}
            onCloseModal={() => setIsOpenModalNewReview(false)}
            product={product.productId}
          />
        )}
        {product?.id && (
          <NewContactToOrder
            show={isOpenModalNewContactToOrder}
            onCloseModal={() => setIsOpenModalNewContactToOrder(false)}
            productOption={product.id}
          />
        )}
      </div>
    </>
  );
};

export default ProductDetail;