"use client";
import React, { useEffect, useRef, useState } from "react";
import { filterFilterOptions, filterProductOptions } from "@/api/products";
import SidebarFilters from "@/app/[locale]/products/components/SidebarFilters";
import Products from "@/app/[locale]/products/components/Products";
import {
  ResultWrapper,
  ShopProductDto,
  ShortProductOptionDto,
} from "@/models/product.model";
import { FilterOptionDto, ProductFilterDto } from "@/models/filter.model";
import { useSearchParams } from "next/navigation";
import ProductsCardsSkeleton from "@/app/[locale]/products/components/ProductsCardsSkeleton";
import Pagination from "@/app/[locale]/products/components/Pagination";
import Skeleton from "react-loading-skeleton";
import Search from "@/app/[locale]/products/components/Search";
import { CategoryDto } from "@/models/category.model";
import { useTranslations } from "next-intl";

// Define props for the component
interface ProductsAndFilterProps {
  initialProductData: ResultWrapper;
  initialFilterOptions: FilterOptionDto;
  s?: string;
}

const ProductsAndFilter = ({
  initialProductData,
  initialFilterOptions,
  s,
}: ProductsAndFilterProps) => {
  const tProducts = useTranslations("Pages.Products");
  const searchParams = useSearchParams();
  const isInitialRender = useRef(true); // Ref to track the initial render

  const getFilterFromSearchParams = (): ProductFilterDto => {
    // This function remains unchanged
    const category = s != "all" ? s : undefined;
    const page = Number(searchParams.get("page")) || 1;
    const term = searchParams.get("term") || "";
    const inActionParam = searchParams.get("inAction");
    const inAction =
      inActionParam === "true"
        ? true
        : inActionParam === "false"
          ? false
          : undefined;

    const variants =
      searchParams
        .get("variant")
        ?.split(",")
        .map(Number)
        .filter((num) => !isNaN(num)) || [];

    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");
    let priceRange = undefined;
    if (minPriceParam && maxPriceParam) {
      priceRange = [Number(minPriceParam), Number(maxPriceParam)];
    }

    const attributes =
      searchParams
        .get("attribute")
        ?.split(",")
        .map(Number)
        .filter((num) => !isNaN(num)) || [];

    return {
      visibility: true,
      category,
      brandId: undefined,
      archived: false,
      active: true,
      priceRange: priceRange,
      page,
      perPage: 36,
      variants,
      attributes,
      name: term,
      inAction,
    };
  };

  // Initialize state with the props passed from the server
  const [productOptions, setProductOptions] = useState<ShortProductOptionDto[]>(
    initialProductData.productOptions,
  );
  const [products, setProducts] = useState<ShopProductDto[] | undefined>(
    initialProductData.products,
  );
  const [filterOption, setFilterOption] = useState<FilterOptionDto | undefined>(
    initialFilterOptions,
  );
  const [totalPages, setTotalPages] = useState(initialProductData.totalPages);
  const [loading, setLoading] = useState(false); // Initial load is done, so start with false
  const [category, setCategory] = useState<CategoryDto | undefined>(
    initialProductData.category,
  );
  const [filter, setFilter] = useState<ProductFilterDto>(
    getFilterFromSearchParams(),
  );

  const fetchProductsAndFilters = async (currentFilter: ProductFilterDto) => {
    setLoading(true);
    try {
      const [productResult, filterResult] = await Promise.all([
        filterProductOptions(currentFilter),
        filterFilterOptions(currentFilter),
      ]);

      setProductOptions(productResult.productOptions);
      setProducts(productResult.products);
      setTotalPages(productResult.totalPages);
      setCategory(productResult.category);
      setFilterOption(filterResult.filter);

      // GTM: Push view_item_list event
      if (
        typeof window !== "undefined" &&
        Array.isArray(productResult.products)
      ) {
        // GTM logic here...
      }
    } catch (error) {
      console.error("Error fetching products or filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // This useEffect now only runs for client-side changes, not for the initial render
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const filterFromParams = getFilterFromSearchParams();
    fetchProductsAndFilters(filterFromParams);
    setFilter(filterFromParams);
  }, [searchParams?.toString()]);

  // Handle filter change by updating URL search params
  const handleFilterChange = (updatedFilters: {
    selectedVariants: string[];
    selectedAttributes: string[];
    priceRange: { min: string; max: string };
  }) => {
    const newSearchParams = new URLSearchParams(window.location.search);

    // Update variants
    if (updatedFilters.selectedVariants.length > 0) {
      newSearchParams.set("variant", updatedFilters.selectedVariants.join(","));
    } else {
      newSearchParams.delete("variant");
    }

    // Update attributes
    if (updatedFilters.selectedAttributes.length > 0) {
      newSearchParams.set(
        "attribute",
        updatedFilters.selectedAttributes.join(","),
      );
    } else {
      newSearchParams.delete("attribute");
    }

    // Update price range
    if (updatedFilters.priceRange.min) {
      newSearchParams.set("min_price", updatedFilters.priceRange.min);
    } else {
      newSearchParams.delete("min_price");
    }

    if (updatedFilters.priceRange.max) {
      newSearchParams.set("max_price", updatedFilters.priceRange.max);
    } else {
      newSearchParams.delete("max_price");
    }

    // A change in filters should always reset the page to 1
    newSearchParams.set("page", "1");

    window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
  };

  // The rest of your JSX remains the same
  return (
    <div className={`nc-PageCollection2 bg-menu-bg-light`}>
      <div className="nc-HeadBackgroundCommon px-4 w-full bg-menu-bg-dark dark:bg-neutral-800/20 pt-10 pb-20 text-center">
        <div className="container"></div>
        {category && category.name ? (
          <h2 className="text-2xl font-semibold mb-2 text-menu-text-light">
            {category.name}
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold mb-2 text-menu-text-light">
            {tProducts.raw("noCategoryName")}
          </h2>
        )}
        {category && category.description ? (
          <h2 className="text-menu-text-light">{category.description}</h2>
        ) : (
          <h2
            className="text-menu-text-light"
            dangerouslySetInnerHTML={{
              __html: tProducts.raw("noCategoryDescription"),
            }}
          ></h2>
        )}
      </div>
      <div className="container -mt-7 mb-12">
        <div className="space-y-10 lg:space-y-14">
          <main>
            <Search />
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar */}
              <div className="lg:w-1/3 xl:w-1/4 pr-4">
                <div className="sticky top-24 max-h-[calc(100vh-9rem)] overflow-y-auto">
                  {filterOption != null ? (
                    <SidebarFilters
                      filterOptions={filterOption}
                      onFilterChange={handleFilterChange}
                    />
                  ) : (
                    <>
                      <Skeleton count={1} height={200} />
                      <Skeleton count={1} height={400} />
                      <Skeleton count={1} height={300} />
                    </>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 mb-2lg:mb-0 lg:mx-4 border-t lg:border-t-0 bg-menu-bg-light"></div>

              {/* Products Section */}
              <div className="flex-1">
                {loading ? (
                  <ProductsCardsSkeleton />
                ) : (
                  <>
                    <Products
                      products={products}
                      productOptions={productOptions}
                    />
                    <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row justify-center ">
                      <Pagination
                        currentPage={filter.page}
                        totalPages={totalPages}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsAndFilter;
