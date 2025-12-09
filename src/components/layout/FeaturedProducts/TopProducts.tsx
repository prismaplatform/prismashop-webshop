"use client";

import React, { useEffect, useState } from "react";
// @ts-ignore
import { ShortProductOptionDto } from "@/models/product.model";
import { getTopProducts } from "@/api/products";
import SectionSliderProductCard from "./SectionSliderProductCard";
import { useTranslations } from "next-intl";

const TopProductCarousel = () => {
  const [products, setProducts] = useState<ShortProductOptionDto[]>([]);
  const t = useTranslations("Pages.Home.FeaturedProducts");

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const result = await getTopProducts();
        setProducts(result);
      } catch (error) {
        console.error("Failed to fetch top products:", error);
      }
    };

    fetchTopProducts();
  }, []);

  // Default to false. It will only become true if the conditions are met.
  let shouldShow = false;

  // Attempt to get the translation key
  const bestSelling = t.raw("bestSellingTitle");
  // If the key exists and its value is "TRUE", allow the component to show
  shouldShow = bestSelling !== "";

  // The component renders only if the flag is true AND there are products to display.
  return (
    shouldShow &&
    products.length > 0 && (
      <SectionSliderProductCard
        heading={t.raw("bestSellingTitle")}
        products={products}
      />
    )
  );
};

export default TopProductCarousel;
