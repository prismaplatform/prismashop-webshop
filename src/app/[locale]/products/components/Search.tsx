"use client";
import Input from "@/components/ui/Input/Input";
import React, { useEffect, useRef, useState } from "react";
import twFocusClass from "@/utils/twFocusClass";
import { Link, usePathname } from "@/i18n/routing";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getSearchSuggestions } from "@/api/products";
import { ShortProductOptionDto } from "@/models/product.model";
import { ProductOptionImageDto } from "@/models/product-option-image.model";
import { useCurrency } from "@/components/app/CurrencyProvider";
import { Route } from "next";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermConst, setSearchTermConst] = useState<string>();
  const [searchResults, setSearchResults] = useState<ShortProductOptionDto[]>(
    [],
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rootUrl, setRootUrl] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const t = useTranslations("Pages.Products");
  const currency = useCurrency();
  const router = useRouter();
  const path = usePathname();

  // Set root URL for images
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

  // Helper function to slugify domain
  const slugifyDomain = (url: string) => {
    let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

    // Check if the URL contains '.prismasolutions.ro' and remove it
    host = host.replace(".prismasolutions.ro", "").replace(".prismaweb.ro", "");

    return host.replace(/[^a-zA-Z0-9]/g, "");
  };

  // Update searchTerm when searchParams change
  useEffect(() => {
    const term = searchParams.get("term") || "";
    setSearchTerm(term);
    setSearchTermConst(term);
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && linkRef.current) {
      e.preventDefault();
      setShowDropdown(false);
      linkRef.current.click();
    }
  };

  const getUrlFilterWithSearchTerm = () => {
    let newSearchParams = new URLSearchParams();
    const page = "1";

    newSearchParams.set("page", page);

    if (searchTerm) {
      newSearchParams.set("term", searchTerm);
    }

    if (newSearchParams.toString() === searchParams.toString()) {
      newSearchParams = new URLSearchParams();
      if (searchTerm) {
        newSearchParams.set("term", searchTerm);
      }
      newSearchParams.set("page", page);
    }

    return {
      pathname: path,
      query: newSearchParams.toString(),
    };
  };

  // Debounced search function
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getSearchSuggestions(term);
      // Limit results to first 15 items
      const limitedResults = data ? data.slice(0, 15) : [];
      setSearchResults(limitedResults);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowDropdown(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const handleProductClick = (product: ShortProductOptionDto) => {
    const variantIds = product.variants.map((v) => v.variantValue.id).join(",");

    let url = `/product/${product.productSlug}`;

    if (variantIds) {
      const params = new URLSearchParams({ variant: variantIds });
      url += `?${params.toString()}`;
    }
    router.push(url as Route);
    setShowDropdown(false);
  };

  const getFirstImageUrl = (images: ProductOptionImageDto[]) => {
    return images?.length
      ? rootUrl + "products/" + images[0]?.image
      : "/placeholder-product.jpg";
  };

  return (
    <div className="container mb-10 relative">
      <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
        <form className="relative w-full z-[9]" method="post">
          <label
            htmlFor="search-input"
            className="text-neutral-500 dark:text-neutral-300"
          >
            <span className="sr-only">Search all icons</span>
            <Input
              className="shadow-lg border-0 dark:border"
              id="search-input"
              type="search"
              placeholder={t("searchBar")}
              sizeClass="pl-14 py-5 pr-5 md:pl-16"
              rounded="rounded-full"
              onKeyDown={handleKeyDown}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => searchTerm && setShowDropdown(true)}
              autoComplete="off"
            />

            <Link
              ref={linkRef}
              className={`ttnc-ButtonCircle flex items-center justify-center rounded-full !leading-none disabled:bg-opacity-70 bg-accent-900 hover:bg-accent-800 text-accent-50 absolute right-2.5 top-1/2 transform -translate-y-1/2 w-9 h-9 ${twFocusClass(true)}`}
              href={getUrlFilterWithSearchTerm()}
            >
              <i className="las la-arrow-right text-xl"></i>
            </Link>

            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>
        </form>

        {/* Search results dropdown */}
        <>
          <div
            className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ease-in-out z-50 ${
              showDropdown
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setShowDropdown(false)}
          ></div>

          <div
            ref={dropdownRef}
            className={`absolute top-full left-5 right-5 lg:left-[20%] lg:right-[20%] z-50 mt-2 bg-white dark:bg-neutral-900 shadow-xl rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ease-in-out transform max-h-[70vh] overflow-y-auto ${
              showDropdown
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            {isLoading ? (
              <div className="p-4 text-center text-neutral-500 dark:text-neutral-300">
                {t("loading")}
              </div>
            ) : searchResults.length > 0 ? (
              <ul>
                {searchResults.slice(0, 15).map((product) => (
                  <li
                    key={product.id}
                    className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer flex items-center"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 mr-3">
                      <Image
                        src={getFirstImageUrl(product.images)}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-800 dark:text-neutral-100">
                        {product.name}
                      </span>
                      {product.brand && (
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {product.brand.name}
                        </span>
                      )}
                      <span className="text-neutral-800 dark:text-neutral-100 font-medium mt-1">
                        {currency.symbol} {product.sellPrice.toFixed(2)}
                        {product.discountPrice && (
                          <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 line-through">
                            {currency.symbol}
                            {product.discountPrice.toFixed(2)}
                          </span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
                {t("noProductsFound") || "No results found"}
              </div>
            )}
          </div>
        </>
      </header>
    </div>
  );
};

export default Search;
