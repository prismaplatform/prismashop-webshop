export interface ContactToOrderDto {
  id?: number;
  name: string;
  email: string;
  quantity: string;
  phone: string;
  message: string;
  createDate?: Date;
  productOption: ProductOptionDto;
}

export interface ProductOptionDto {
  id: number;
}
