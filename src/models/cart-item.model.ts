export interface CartItem {
  id: number;
  name: string;
  brand: string;
  categories: string;
  image: string;
  link: string;
  price: number;
  discountPrice: number;
  stock: number;
  sku: string;
  currentStock: number;
  quantity: number;
  tvaPercent: number;
  vat?: number;
  vatDiscount?: number;
  discount?: number;
}
