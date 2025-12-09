export interface OrderDto {
  id?: number;
  transactionId?: string;
  amount: number;
  paymentType?: PaymentType;
}

export interface NewOrderDto {
  customerAddress: CustomerAddressDto;
  customer?: UserResponseDto;
  observation?: string;
  orderItems: OrderItemDto[];
  paymentType: PaymentType;
  lang: string;
}

export interface OrderItemDto {
  id?: number;
  productOption?: ProductOptionDto;
  quantity?: number;
  returnableQuantity?: number;
  discount?: number;
  price?: number;
  tax?: number;
}

// CORRECTED: Added optional isDeleted and userId properties
export interface CustomerAddressDto {
  id?: number;
  shippingAddress: ShippingAddressDto;
  billingAddress: BillingAddressDto;
  billingType: BillingType;
  main: boolean;
  isDeleted?: boolean; // For soft deletes from API
  userId?: number; // To associate with a user
}

// CORRECTED: Simplified for Hungarian market
export interface ShippingAddressDto {
  id?: number;
  city: string;
  zip: string;
  street: string; // Combined street name and number
  apartment?: string; // For floor, door, etc.
  edited: boolean;
}

// CORRECTED: Simplified for Hungarian market
export interface BillingAddressDto {
  id?: number;
  companyName?: string;
  companyTaxId?: string;
  city: string;
  zip: string;
  street: string; // Combined street name and number
  apartment?: string; // For floor, door, etc.
  edited: boolean;
}

export interface UserResponseDto {
  id?: number;
  name: string; // Single field for full name
  email: string;
  userImage?: string;
  active?: boolean;
  role?: Role;
  phone?: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface ProductOptionDto {}

export enum BillingType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export enum Role {
  CUSTOMER = "CUSTOMER",
}

export enum PaymentType {
  NONE = "NONE",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  CARD_PAYMENT = "CARD_PAYMENT",
  TRANSFER = "TRANSFER",
}
