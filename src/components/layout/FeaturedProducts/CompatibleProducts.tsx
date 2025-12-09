"use client";

import React, { useEffect, useState } from "react";
import { ShortProductOptionDto } from "@/models/product.model";
import { getConnectedProducts } from "@/api/products";
import SectionSliderProductCard from "./SectionSliderProductCard";
import { useTranslations } from "next-intl";

interface CompatibleProductsCarouselProps {
  queryParam?: number;
}

const CompatibleProductsCarousel: React.FC<CompatibleProductsCarouselProps> = ({
  queryParam = 0,
}) => {
  const [products, setProducts] = useState<ShortProductOptionDto[]>([]);
  const t = useTranslations("Pages.Products");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let ids: number[] = [];
        if (queryParam) {
          ids.push(queryParam);
        }
        let result = null;
        if (ids.length > 0) {
          result = await getConnectedProducts(ids);
        }
        if (result) {
          setProducts(result);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchProducts();
  }, [queryParam]);

  return (
    products.length > 0 && (
      <SectionSliderProductCard
        heading={t("compatibleProducts") || "Produse compatibile"}
        products={products}
      />
    )
  );
};

export default CompatibleProductsCarousel;
