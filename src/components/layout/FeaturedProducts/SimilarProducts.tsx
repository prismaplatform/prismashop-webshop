"use client";

import React, { useEffect, useState } from "react";
import { ShortProductOptionDto } from "@/models/product.model";
import { getSimilarProducts } from "@/api/products";
import SectionSliderProductCard from "./SectionSliderProductCard";
import { useTranslations } from "next-intl";

interface SimilarProductsCarouselProps {
  queryParam?: number;
}

const SimilarProductsCarousel: React.FC<SimilarProductsCarouselProps> = ({
  queryParam = 0,
}) => {
  const [products, setProducts] = useState<ShortProductOptionDto[]>([]);
  const t = useTranslations("Pages.Products");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getSimilarProducts(queryParam);
        setProducts(result);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchProducts();
  }, [queryParam]);

  return (
    products.length > 0 && (
      <SectionSliderProductCard
        heading={t("similarProducts") || "Similar Products"}
        products={products}
      />
    )
  );
};

export default SimilarProductsCarousel;
