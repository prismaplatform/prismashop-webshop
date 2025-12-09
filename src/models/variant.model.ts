export interface VariantDto {
  id: number;
  variantValue: VariantValueDto;
}

export interface VariantValueDto {
  id: number;
  variantType: VariantTypeDto;
  value: string;
  image: string;
}

export interface VariantTypeDto {
  id: number;
  name: string;
}

export interface VariantTypeWithValuesDto {
  id: number;
  name: string;
  values: SimpleVariantValueDto[];
}

export interface SimpleVariantValueDto {
  id: number;
  value: string;
  image: string;
}
