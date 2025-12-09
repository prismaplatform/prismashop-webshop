"use client";

import React, { useEffect, useState } from "react"; // @ts-ignore
import { ShortProductOptionDto } from "@/models/product.model";
import { getNewProducts } from "@/api/products";
import SectionSliderProductCard from "./SectionSliderProductCard";
import { useTranslations } from "next-intl";

const NewProductCarousel = () => {
  const [products, setProducts] = useState<ShortProductOptionDto[]>([]);
  const t = useTranslations("Pages.Home.FeaturedProducts");

  useEffect(() => {
    fetchNewProducts();
  }, []);

  // Function to fetch products based on filter
  const fetchNewProducts = async () => {
    try {
      const result = await getNewProducts();
      setProducts(result);
    } catch (error) {}
  };

  return (
    <SectionSliderProductCard
      heading={t.raw("newProductsTitle")}
      products={products}
    />
  );
};

export default NewProductCarousel;
