export interface AttributeDto {
  id: number;
  variantValue: AttributeValueDto;
}

export interface AttributeValueDto {
  id: number;
  attributeType: AttributeTypeDto;
  value: string;
}

export interface AttributeTypeDto {
  id: number;
  name: string;
}
