import {
  OrderDto,
  OrderItemDto,
  ShippingAddressDto,
} from "@/models/order-detail.model";

export interface ReturnOrderItemDto {
  id?: number;
  orderItem: OrderItemDto;
  returnOrder?: ReturnOrderDto;
  quantity: number;
  reason: string;
}

export interface ReturnOrderDto {
  id?: number;
  order: OrderDto;
  createdDate?: Date | string;
  modifiedDate?: Date | string;
  awb?: string;
  courierId?: number;
  courierUniqueId?: string;
  status?: number;
  paymentType?: string;
  shippingAddress: ShippingAddressDto;
  returnOrderItems: ReturnOrderItemDto[];
  courierPrice?: number;
  courierPriceNoVat?: number;
  estimatedPickupDate?: Date | string;
  courierName?: string;
  courierServiceName?: string;
  invoiceSeries?: string;
  invoiceNumber?: string;
  bankAccount: string;
}

export interface ReturnOrderResponseDto extends ReturnOrderDto {}
