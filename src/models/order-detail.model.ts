export interface OrderDto {
  id?: number; // Nullable for OnUpdate validation in Java
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

export interface CustomerAddressDto {
  id?: number;
  shippingAddress: ShippingAddressDto;
  billingAddress: BillingAddressDto;
  billingType: BillingType;
  main: boolean;
}

// In your order-detail.model.ts
export interface FormFieldValidation {
  isValid: boolean;
  message?: string;
}

export interface FormValidations {
  [key: string]: FormFieldValidation;
}

export interface ShippingAddressDto {
  id?: number;
  country: string;
  city: string;
  zip: string;
  county: string;
  street: string;
  number: string;
  block?: string;
  apartment?: string;
  edited: boolean;
}

export interface BillingAddressDto {
  id?: number;
  companyName?: string;
  companyTaxId?: string;
  cnp?: string;
  registryCode?: string;
  address: string;
  country: string;
  city: string;
  zip: string;
  county?: string;
  street: string;
  number: string;
  block?: string;
  apartment?: string;
  edited: boolean;
}

export interface UserResponseDto {
  id?: number;
  name: string;
  email: string;
  userImage?: string;
  active?: boolean;
  role?: Role;
  phone?: string;
  password?: string;
}

export interface UpdatePasswordDto {
  newPassword: string;
  oldPassword: string;
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

export function convertBillingTypeToRomanian(type: BillingType): string {
  switch (type) {
    case BillingType.INDIVIDUAL:
      return "Persoană fizică";
    case BillingType.COMPANY:
      return "Companie";
    default:
      return "Necunoscut";
  }
}

export enum PaymentType {
  NONE = "NONE",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  CARD_PAYMENT = "CARD_PAYMENT",
  TRANSFER = "TRANSFER",
}
