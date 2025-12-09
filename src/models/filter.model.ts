export interface ProductFilterDto {
  visibility?: boolean;
  categoryId?: number;
  category?: string;
  productId?: number;
  productSlug?: string;
  name?: string;
  brandId?: number;
  variants: number[];
  attributes?: number[];
  priceRange?: number[];
  archived?: boolean;
  active?: boolean;
  page?: number;
  perPage: number;
  featured?: boolean;
  inAction?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  children: Category[];
  icon: string;
}

export interface VariantValue {
  name: string;
  image: string;
  id: number;
}

export interface VariantType {
  name: string;
  variants: VariantValue[];
}

export interface AttributeValue {
  name: string;
  id: number;
}

export interface AttributeType {
  name: string;
  attributes: AttributeValue[];
}

export interface FilterOptionDto {
  categories: Category[];
  variantTypes: VariantType[];
  attributeTypes: AttributeType[];
  priceRange: [number, number];
}
