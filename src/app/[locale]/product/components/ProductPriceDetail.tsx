import { TagIcon } from "@heroicons/react/24/solid";
import { ShortProductOptionDetailDto } from "@/models/product.model";
import Skeleton from "react-loading-skeleton";
import Prices from "@/components/ui/Prices/Prices";
import { useCurrency } from "@/components/app/CurrencyProvider";

const formatPrice = (value: number): string => {
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
};

const ProductPriceDetail = ({ product }: { product: ShortProductOptionDetailDto }) => {
  const currency = useCurrency();

  if (!product?.sellPrice) {
    return <Skeleton width={150} height={40} />;
  }

  const { sellPrice, discountPrice } = product;

  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < sellPrice;

  const discountPercent = hasDiscount
    ? Math.round(((sellPrice - discountPrice) / sellPrice) * 100)
    : 0;

  return (
    <div className="bg-menu-bg-dark p-5 rounded-xl">
      {hasDiscount ? (
        <div className="flex flex-col items-start">
          <span className="text-sm text-menu-text-light line-through">
            {formatPrice(sellPrice)} {currency.symbol}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-primary-500 font-semibold flex items-center space-x-1">
              <TagIcon className="h-5 w-5 text-primary-500" />
              <span>
                {formatPrice(discountPrice)} {currency.symbol}
              </span>
            </span>
            <span className="text-sm text-primary-500 font-semibold">-{discountPercent}%</span>
          </div>
        </div>
      ) : (
        <Prices
          contentClass="text-3xl font-bold text-menu-text-light dark:text-gray-100"
          price={sellPrice}
        />
      )}
    </div>
  );
};

export default ProductPriceDetail;
