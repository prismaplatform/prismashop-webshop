"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronDown, Filter } from "lucide-react";
import ReactSlider from "react-slider";
import { FilterOptionDto } from "@/models/filter.model";
import { useCurrency } from "@/components/app/CurrencyProvider";

// No changes to Checkbox component
interface CheckboxProps {
  label?: string | React.ReactNode;
  subLabel?: string;
  className?: string;
  sizeClassName?: string;
  labelClassName?: string;
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  subLabel,
  name,
  className = "",
  sizeClassName = "w-5 h-5",
  labelClassName = "",
  checked,
  onChange,
}) => {
  return (
    <div className={`group flex items-center space-x-3 ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`rounded border-black text-primary-800 focus:ring-black bg-white dark:bg-gray-800 cursor-pointer transition-colors ${sizeClassName}`}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      </div>
      {label && (
        <label
          htmlFor={name}
          className="flex flex-col flex-1 text-sm font-medium text-menu-text-light"
        >
          <span className={labelClassName}>{label}</span>
          {subLabel && (
            <span className="text-xs font-normal text-menu-text-light mt-0.5">
              {subLabel}
            </span>
          )}
        </label>
      )}
    </div>
  );
};

// No changes to AccordionItem component
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  contentId: string;
  titleId: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  contentId,
  titleId,
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <h3>
        <button
          id={titleId}
          onClick={onToggle}
          className="flex justify-between items-center w-full py-3 px-1 hover:bg-menu-bg-dark dark:hover:bg-gray-800 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <span className="font-medium text-menu-text-light dark:text-gray-100">
            {title}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-menu-text-light dark:text-gray-400 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={contentId}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"}`}
      >
        <div
          className={`pb-4 pt-2 px-1 transition-opacity duration-300 ${!isOpen ? "opacity-0 invisible" : "opacity-100 visible"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

interface SidebarFiltersProps {
  filterOptions: FilterOptionDto;
  onFilterChange: (filters: {
    selectedVariants: string[];
    selectedAttributes: string[];
    priceRange: { min: string; max: string };
  }) => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filterOptions,
  onFilterChange,
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const t = useTranslations("Pages.Products");

  const [MIN_PRICE = 0, MAX_PRICE = 1000] = filterOptions.priceRange ?? [];
  const linkRef = useRef<HTMLButtonElement | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);

  const currency = useCurrency();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => ({
      categories: true,
      price: true,
    }),
  );

  const applyFilters = useCallback(
    (
      currentVariants: string[],
      currentAttributes: string[],
      currentPriceRange: [number, number],
    ) => {
      const priceRangeForUrl = {
        min:
          currentPriceRange[0] > MIN_PRICE ? String(currentPriceRange[0]) : "",
        max:
          currentPriceRange[1] < MAX_PRICE ? String(currentPriceRange[1]) : "",
      };
      onFilterChange({
        selectedVariants: currentVariants,
        selectedAttributes: currentAttributes,
        priceRange: priceRangeForUrl,
      });
    },
    [onFilterChange, MIN_PRICE, MAX_PRICE],
  );

  useEffect(() => {
    const variantsFromUrl = (
      searchParams.get("variant")?.split(",") || []
    ).filter(Boolean);
    const attributesFromUrl = (
      searchParams.get("attribute")?.split(",") || []
    ).filter(Boolean);

    const minPriceFromUrl = Number(searchParams.get("min_price") || MIN_PRICE);
    const maxPriceFromUrl = Number(searchParams.get("max_price") || MAX_PRICE);

    setSelectedVariants(variantsFromUrl);
    setSelectedAttributes(attributesFromUrl);

    setPriceRange((currentRange) => {
      if (
        currentRange[0] !== minPriceFromUrl ||
        currentRange[1] !== maxPriceFromUrl
      ) {
        return [minPriceFromUrl, maxPriceFromUrl];
      }
      return currentRange;
    });

    setOpenSections((prevOpen) => {
      const newOpenSections = { ...prevOpen };
      if (newOpenSections["categories"] === undefined) {
        newOpenSections["categories"] = true;
      }
      filterOptions.variantTypes?.forEach((variantType) => {
        const sectionKey = `variant-${variantType.name}`;
        newOpenSections[sectionKey] = variantType.variants.some((v) =>
          variantsFromUrl.includes(v.id.toString()),
        );
      });
      filterOptions.attributeTypes?.forEach((attributeType) => {
        const sectionKey = `attribute-${attributeType.name}`;
        newOpenSections[sectionKey] = attributeType.attributes.some((a) =>
          attributesFromUrl.includes(a.id.toString()),
        );
      });
      return newOpenSections;
    });
  }, [
    searchParams,
    filterOptions.variantTypes,
    filterOptions.attributeTypes,
    MIN_PRICE,
    MAX_PRICE,
  ]);

  const handleVariantChange = (value: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedVariants, value]
      : selectedVariants.filter((v) => v !== value);
    setSelectedVariants(newSelected);
    applyFilters(newSelected, selectedAttributes, priceRange);
  };

  const handleAttributeChange = (value: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedAttributes, value]
      : selectedAttributes.filter((a) => a !== value);
    setSelectedAttributes(newSelected);
    applyFilters(selectedVariants, newSelected, priceRange);
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const getUrlFilterWithCategory = (categorySlug: string | null) => {
    const newSearchParams = new URLSearchParams();

    newSearchParams.set("page", "1");

    const newPathname = `/products/${categorySlug || "all"}`;

    return {
      pathname: newPathname,
      query: newSearchParams.toString(),
    };
  };

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [visibleCategories, setVisibleCategories] = useState(5);

  const toggleExpand = (categorySlug: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }));
  };

  // No changes to PriceFilterAccordion component
  const PriceFilterAccordion = () => {
    const [localPrice, setLocalPrice] = useState<[string, string]>([
      String(priceRange[0]),
      String(priceRange[1]),
    ]);

    useEffect(() => {
      const localMin = parseInt(localPrice[0], 10);
      const localMax = parseInt(localPrice[1], 10);
      if (localMin !== priceRange[0] || localMax !== priceRange[1]) {
        setLocalPrice([String(priceRange[0]), String(priceRange[1])]);
      }
    }, [priceRange]);

    const handlePriceInputChange = (index: number, value: string) => {
      const newLocalPrice: [string, string] = [...localPrice];
      newLocalPrice[index] = value;
      setLocalPrice(newLocalPrice);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter" && linkRef.current) {
        e.preventDefault();
        linkRef.current.click();
      }
    };

    const handleApplyPriceFilter = () => {
      let min = parseInt(localPrice[0], 10);
      let max = parseInt(localPrice[1], 10);

      min = isNaN(min) ? MIN_PRICE : min;
      max = isNaN(max) ? MAX_PRICE : max;

      if (min > max) {
        setPriceRange([max, min]);
        applyFilters(selectedVariants, selectedAttributes, [max, min]);
      } else {
        setPriceRange([min, max]);
        applyFilters(selectedVariants, selectedAttributes, [min, max]);
      }
    };

    const handleSliderChangeComplete = (newValue: [number, number]) => {
      setPriceRange(newValue);
      applyFilters(selectedVariants, selectedAttributes, newValue);
    };

    return (
      <AccordionItem
        title={t("SideBar.priceRange")}
        isOpen={openSections["price"]}
        onToggle={() => toggleSection("price")}
        contentId="filter-price-content"
        titleId="filter-price-title"
      >
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between gap-2 mb-4">
            <input
              type="number"
              onKeyDown={handleKeyDown}
              value={localPrice[0]}
              onChange={(e) => handlePriceInputChange(0, e.target.value)}
              className="w-full p-2 text-center border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Minimum price"
            />
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <input
              type="number"
              onKeyDown={handleKeyDown}
              value={localPrice[1]}
              onChange={(e) => handlePriceInputChange(1, e.target.value)}
              className="w-full p-2 text-center border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Maximum price"
            />
          </div>

          <ReactSlider
            className="slider"
            thumbClassName="thumb"
            trackClassName="track"
            value={priceRange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            ariaLabel={["Lower thumb", "Upper thumb"]}
            ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
            pearling
            minDistance={1}
            onAfterChange={(newValue) =>
              handleSliderChangeComplete(newValue as [number, number])
            }
            renderThumb={(props, state) => {
              const { key, ...thumbProps } = props;
              return <div key={key} {...thumbProps} />;
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
            <span className="text-menu-text-light">
              {MIN_PRICE}
              <span className="ms-1">{currency.symbol}</span>
            </span>
            <span className="text-menu-text-light">
              {MAX_PRICE}
              <span className="ms-1">{currency.symbol}</span>
            </span>
          </div>

          <div className="mt-4">
            <button
              ref={linkRef}
              onClick={handleApplyPriceFilter}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-primary-500"
            >
              {t("SideBar.apply")}
            </button>
          </div>
        </div>
      </AccordionItem>
    );
  };

  return (
    <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="md:hidden space-y-2">
        {/* Categories Section (Mobile) */}
        <div>
          <button
            onClick={() => {
              setIsCategoriesOpen(!isCategoriesOpen);
              setIsFiltersOpen(false);
            }}
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-menu-bg-dark text-menu-text-dark focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-controls="sidebar-categories-content"
            aria-expanded={isCategoriesOpen}
          >
            <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
            {t("SideBar.accordionCategories")}
            <ChevronDown
              className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${isCategoriesOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          <div
            id="sidebar-categories-content"
            className={`
              transition-all duration-500 ease-in-out overflow-hidden
              ${isCategoriesOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}
              bg-menu-bg-light text-menu-text-dark
            `}
            role="dialog"
            aria-modal={isCategoriesOpen}
          >
            <div className="overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-semibold">
                  {isCategoriesOpen && (
                    // FIX: Pass the object returned by the helper function directly to href.
                    <Link
                      href={getUrlFilterWithCategory(null)}
                      className="mt-4 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 hover:underline"
                    >
                      {t("SideBar.categories")}
                    </Link>
                  )}
                </h3>

                {filterOptions.categories
                  ?.slice(0, visibleCategories)
                  .map((category) => {
                    const isExpanded =
                      expandedCategories[category.slug] || false;
                    const visibleSubcategories = isExpanded
                      ? category.children
                      : category.children?.slice(0, 100) || [];
                    const categoryUrl = getUrlFilterWithCategory(category.slug);

                    return (
                      <div className="space-y-2" key={category.slug}>
                        <div>
                          {/* FIX: Use the 'query' prop instead of 'search'. */}
                          <Link
                            href={{
                              pathname: categoryUrl.pathname,
                              query: categoryUrl.query,
                            }}
                            className="hover:underline text-sm text-menu-text-dark  hover:text-primary-500 "
                          >
                            {category.name}
                          </Link>
                        </div>

                        {category.children && category.children.length > 0 && (
                          <div className="pl-3 space-y-1.5 border-l border-gray-200 dark:border-gray-700 ml-1">
                            {visibleSubcategories.map((subCategory) => {
                              const subCategoryUrl = getUrlFilterWithCategory(
                                subCategory.slug,
                              );
                              return (
                                <div key={subCategory.slug}>
                                  {/* FIX: Use the 'query' prop instead of 'search'. */}
                                  <Link
                                    href={{
                                      pathname: subCategoryUrl.pathname,
                                      query: subCategoryUrl.query,
                                    }}
                                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
                                  >
                                    {subCategory.name}
                                  </Link>
                                </div>
                              );
                            })}
                            {category.children.length > 100 && (
                              <button
                                className="text-primary-600 dark:text-primary-400 text-xs mt-1 font-medium hover:underline"
                                onClick={() => toggleExpand(category.slug)}
                              >
                                {isExpanded
                                  ? t("SideBar.showLess")
                                  : t("SideBar.showMore")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {filterOptions.categories &&
                  filterOptions.categories.length > visibleCategories && (
                    <button
                      className="text-primary-600 dark:text-primary-400 text-sm mt-2 font-medium hover:underline"
                      onClick={() =>
                        setVisibleCategories((prev) =>
                          prev === 5 ? filterOptions.categories!.length : 5,
                        )
                      }
                    >
                      {visibleCategories === 5
                        ? t("SideBar.showMore")
                        : t("SideBar.showLess")}
                    </button>
                  )}
                {filterOptions.categories &&
                  filterOptions.categories.length <= 5 &&
                  filterOptions.categories.length > 0 &&
                  visibleCategories > 5 && (
                    <button
                      className="text-primary-600 dark:text-primary-400 text-sm mt-2 font-medium hover:underline"
                      onClick={() => setVisibleCategories(5)}
                    >
                      {t("SideBar.showLess")}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section (Mobile) */}
        <div>
          <button
            onClick={() => {
              setIsFiltersOpen(!isFiltersOpen);
              setIsCategoriesOpen(false);
            }}
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium bg-menu-bg-dark text-menu-text-dark focus:outline-none focus:ring-2 focus:ring-offset-2 "
            aria-controls="sidebar-filters-content"
            aria-expanded={isFiltersOpen}
          >
            <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
            {t("SideBar.filters")}
            <ChevronDown
              className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${isFiltersOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          <div
            id="sidebar-filters-content"
            className={`
              transition-all duration-500 ease-in-out overflow-hidden
              ${isFiltersOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}
              p-4
            `}
            role="dialog"
            aria-modal={isFiltersOpen}
          >
            <div className="bg-menu-bg-light text-menu-text-dark">
              <div className="space-y-4">
                <PriceFilterAccordion />

                {filterOptions.variantTypes?.map((variantType) => {
                  const sectionKey = `variant-${variantType.name}`;
                  return (
                    <AccordionItem
                      key={sectionKey}
                      title={variantType.name}
                      isOpen={openSections[sectionKey]}
                      onToggle={() => toggleSection(sectionKey)}
                      contentId={`filter-${sectionKey}-content`}
                      titleId={`filter-${sectionKey}-title`}
                    >
                      <div className="space-y-3 max-h-60 overflow-y-auto px-1">
                        {variantType.variants.map((variant) => (
                          <Checkbox
                            key={variant.id}
                            name={`variant-${variant.id}`}
                            label={variant.name}
                            checked={selectedVariants.includes(
                              variant.id.toString(),
                            )}
                            onChange={(checked) =>
                              handleVariantChange(
                                variant.id.toString(),
                                checked,
                              )
                            }
                          />
                        ))}
                      </div>
                    </AccordionItem>
                  );
                })}

                {filterOptions.attributeTypes?.map((attributeType) => {
                  const sectionKey = `attribute-${attributeType.name}`;
                  return (
                    <AccordionItem
                      key={sectionKey}
                      title={attributeType.name}
                      isOpen={openSections[sectionKey]}
                      onToggle={() => toggleSection(sectionKey)}
                      contentId={`filter-${sectionKey}-content`}
                      titleId={`filter-${sectionKey}-title`}
                    >
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {attributeType.attributes.map((attribute) => (
                          <Checkbox
                            key={attribute.id}
                            name={`attribute-${attribute.id}`}
                            label={attribute.name}
                            checked={selectedAttributes.includes(
                              attribute.id.toString(),
                            )}
                            onChange={(checked) =>
                              handleAttributeChange(
                                attribute.id.toString(),
                                checked,
                              )
                            }
                          />
                        ))}
                      </div>
                    </AccordionItem>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="space-y-4">
          <AccordionItem
            title={t("SideBar.accordionCategories")}
            isOpen={openSections["categories"]}
            onToggle={() => toggleSection("categories")}
            contentId="filter-categories-content"
            titleId="filter-categories-title"
          >
            <div className="space-y-4">
              <h3 className="font-semibold mb-2.5">
                {/* FIX: Use the generated URL from the helper function, not the existing pathname. */}
                <Link
                  href={getUrlFilterWithCategory(null)}
                  className="text-menu-text-light hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 hover:underline"
                >
                  {t("SideBar.categories")}
                </Link>
              </h3>

              {filterOptions.categories
                ?.slice(0, visibleCategories)
                .map((category) => {
                  const isExpanded = expandedCategories[category.slug] || false;
                  const visibleSubcategories = isExpanded
                    ? category.children
                    : category.children?.slice(0, 100) || [];
                  const categoryUrl = getUrlFilterWithCategory(category.slug);

                  return (
                    <div className="space-y-2" key={category.slug}>
                      <div>
                        {/* FIX: Use the 'query' prop instead of 'search'. */}
                        <Link
                          href={{
                            pathname: categoryUrl.pathname,
                            query: categoryUrl.query,
                          }}
                          className="hover:underline text-sm text-menu-text-light dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {category.name}
                        </Link>
                      </div>

                      {category.children && category.children.length > 0 && (
                        <div className="pl-3 space-y-1.5 border-l border-gray-200 dark:border-gray-700 ml-1">
                          {visibleSubcategories.map((subCategory) => {
                            const subCategoryUrl = getUrlFilterWithCategory(
                              subCategory.slug,
                            );
                            return (
                              <div key={subCategory.slug}>
                                {/* FIX: Use the 'query' prop instead of 'search'. */}
                                <Link
                                  href={{
                                    pathname: subCategoryUrl.pathname,
                                    query: subCategoryUrl.query,
                                  }}
                                  className="block text-sm text-menu-text-light dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
                                >
                                  {subCategory.name}
                                </Link>
                              </div>
                            );
                          })}
                          {category.children.length > 100 && (
                            <button
                              className="text-menu-text-light dark:text-primary-400 text-xs mt-1 font-medium hover:underline"
                              onClick={() => toggleExpand(category.slug)}
                            >
                              {isExpanded
                                ? t("SideBar.showLess")
                                : t("SideBar.showMore")}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

              {filterOptions.categories &&
                filterOptions.categories.length > visibleCategories && (
                  <button
                    className="text-menu-text-light dark:text-primary-400 text-sm mt-2 font-medium hover:underline"
                    onClick={() =>
                      setVisibleCategories((prev) =>
                        prev === 5 ? filterOptions.categories!.length : 5,
                      )
                    }
                  >
                    {visibleCategories === 5
                      ? t("SideBar.showMore")
                      : t("SideBar.showLess")}
                  </button>
                )}
              {filterOptions.categories &&
                filterOptions.categories.length <= 5 &&
                filterOptions.categories.length > 0 &&
                visibleCategories > 5 && (
                  <button
                    className="text-menu-text-light dark:text-primary-400 text-sm mt-2 font-medium hover:underline"
                    onClick={() => setVisibleCategories(5)}
                  >
                    {t("SideBar.showLess")}
                  </button>
                )}
            </div>
          </AccordionItem>

          <PriceFilterAccordion />

          {filterOptions.variantTypes?.map((variantType) => {
            const sectionKey = `variant-${variantType.name}`;
            return (
              <AccordionItem
                key={sectionKey}
                title={variantType.name}
                isOpen={openSections[sectionKey]}
                onToggle={() => toggleSection(sectionKey)}
                contentId={`filter-${sectionKey}-content`}
                titleId={`filter-${sectionKey}-title`}
              >
                <div className="space-y-3 max-h-60 overflow-y-auto px-1">
                  {variantType.variants.map((variant) => (
                    <Checkbox
                      key={variant.id}
                      name={`variant-${variant.id}`}
                      label={variant.name}
                      checked={selectedVariants.includes(variant.id.toString())}
                      onChange={(checked) =>
                        handleVariantChange(variant.id.toString(), checked)
                      }
                    />
                  ))}
                </div>
              </AccordionItem>
            );
          })}

          {filterOptions.attributeTypes?.map((attributeType) => {
            const sectionKey = `attribute-${attributeType.name}`;
            return (
              <AccordionItem
                key={sectionKey}
                title={attributeType.name}
                isOpen={openSections[sectionKey]}
                onToggle={() => toggleSection(sectionKey)}
                contentId={`filter-${sectionKey}-content`}
                titleId={`filter-${sectionKey}-title`}
              >
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {attributeType.attributes.map((attribute) => (
                    <Checkbox
                      key={attribute.id}
                      name={`attribute-${attribute.id}`}
                      label={attribute.name}
                      checked={selectedAttributes.includes(
                        attribute.id.toString(),
                      )}
                      onChange={(checked) =>
                        handleAttributeChange(attribute.id.toString(), checked)
                      }
                    />
                  ))}
                </div>
              </AccordionItem>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;