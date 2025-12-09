export interface ReviewDto {
  id?: number;
  name: string;
  email: string;
  rating: number;
  review: string;
  visible?: boolean;
  createDate?: Date;
  modifiedDate?: Date;
  product: ProductDto;
}

export interface ProductDto {
  id: number;
}
