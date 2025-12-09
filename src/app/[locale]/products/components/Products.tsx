"use client";
import React from "react";
import ProductOptionCard from "@/components/layout/ProductCard/ProductOptionCard";
import { ShopProductDto, ShortProductOptionDto } from "@/models/product.model";
import ProductCard from "@/components/layout/ProductCard/ProductCard";
import { useTranslations } from "next-intl";

interface ProductsProps {
  productOptions?: ShortProductOptionDto[];
  products?: ShopProductDto[];
}

const Products: React.FC<ProductsProps> = ({ productOptions, products }) => {
  const t = useTranslations("Pages.Products");

  return (
    <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-1 gap-y-5">
      {productOptions && productOptions.length > 0 ? (
        productOptions.map((item, index) => (
          <ProductOptionCard index={index} data={item} key={index} />
        ))
      ) : products && products.length > 0 ? (
        products.map((item, index) => <ProductCard index={index} data={item} key={index} />)
      ) : (
        <div>{t("noProductsFound")}</div>
      )}
    </div>
  );
};

export default Products;
