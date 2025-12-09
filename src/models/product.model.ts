import { VariantDto, VariantTypeWithValuesDto } from "@/models/variant.model";
import { FilterOptionDto } from "@/models/filter.model";
import { BrandDto } from "@/models/brand.model";
import { CategoryDto } from "@/models/category.model";
import { ProductOptionImageDto } from "@/models/product-option-image.model";
import { AttributeDto } from "@/models/attribute.model";
import { ReviewDto } from "@/models/review.model";
import { GoogleMerchantDto } from "@/models/google-merchant.model";

export interface ResultWrapper {
  productOptions: ShortProductOptionDto[];
  products: ShopProductDto[];
  product: ShortProductOptionDetailDto;
  category: CategoryDto;
  reviews: ReviewDto[];
  totalPages: number;
  filter: FilterOptionDto;
  googleMerchant: GoogleMerchantDto;
  validCombinations?: number[][];
}

export interface ShortProductOptionDto {
  id: number;
  productSlug: string;
  productId: number;
  name: string;
  featured: boolean;
  images: ProductOptionImageDto[];
  stock: number;
  sku: string;
  sellPrice: number;
  discountPrice: number | null;
  brand: BrandDto;
  categories: CategoryDto[];
  variants: VariantDto[];
  rating: number;
  vat?: number;
}

export interface ShopProductDto {
  id: number;
  slug: string;
  name: string;
  brand: string;
  categories: string;
  image: string;
  rating: number;
  variantTypes: VariantTypeWithValuesDto[];
  priceInterval: PriceIntervalDto;
  discountPriceInterval: PriceIntervalDto;
  link: string;
}

export interface PriceIntervalDto {
  minPrice: number;
  maxPrice: number;
}

export interface ShortProductOptionDetailDto {
  id: number;
  productId: number;
  productSlug: string;
  name: string;
  sku: string;
  featured: boolean;
  images: ProductOptionImageDto[];
  stock: number;
  sellPrice: number;
  discountPrice: number;
  vat: number;
  brand: BrandDto;
  categories: CategoryDto[];
  variants: VariantDto[];
  description: string;
  shortDescription: string;
  attributes: AttributeDto[];
  rating: number;
  seoKeywords: string;
  googleMerchant: GoogleMerchantDto;
}

export enum Status {
  SOLD_OUT = "Sold out",
}
