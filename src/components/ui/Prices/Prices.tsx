"use client";
import { useCurrency } from "@/components/app/CurrencyProvider";
import { useTranslations } from "next-intl";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  priceRange?: string;
  discountPrice?: number | null;
  contentClass?: string;
}

const formatPrice = (value: number): string => {
  // If it's an integer like 14000.00 → "14000"
  // If it has decimals like 14000.05 → "14000.05"
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
};

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  discountPrice = 0,
  priceRange = null,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
}) => {
  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
  const t = useTranslations("Pages.Products");
  const currency = useCurrency();

  const discountPercentage = hasDiscount
    ? Number((((price - discountPrice) / price) * 100).toFixed(2))
    : 0;

  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {hasDiscount ? (
        <>
          {/* Discount price above actual price */}
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs text-menu-text-light font-medium mb-1 line-through">
              {formatPrice(price)} {currency.symbol}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-menu-text-light">
                {formatPrice(discountPrice)}
              </span>
              <span className="text-l font-semibold text-menu-text-light">{currency.symbol}</span>
            </div>
          </div>
        </>
      ) : priceRange ? (
        <>
          <span className="text-sm font-semibold text-gray-500">{t("from")}</span>
          <span className="text-xl font-semibold text-menu-text-light">{priceRange}</span>
          <span className="text-l font-semibold text-menu-text-light">{currency.symbol}</span>
        </>
      ) : (
        <>
          <span className="text-xl font-semibold text-menu-text-light">{formatPrice(price)}</span>
          <span className="text-l font-semibold text-menu-text-light">{currency.symbol}</span>
        </>
      )}
    </div>
  );
};

export default Prices;
