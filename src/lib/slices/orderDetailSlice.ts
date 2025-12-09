import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  CustomerAddressDto,
  NewOrderDto,
  PaymentType,
  UserResponseDto,
} from "@/models/order-detail.model";

type OrderDetailState = NewOrderDto;

const initialState: OrderDetailState = Cookies.getJSON("orderDetails") || {};

const orderDetailSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    addOrUpdateCustomer: (state, action: PayloadAction<UserResponseDto>) => {
      state.customer = action.payload;
      Cookies.set("orderDetails", JSON.stringify(state));
    },

    addOrUpdateAddress: (state, action: PayloadAction<CustomerAddressDto>) => {
      state.customerAddress = action.payload;
      Cookies.set("orderDetails", JSON.stringify(state));
    },

    removeCustomer: (state) => {
      state.customer = undefined;
      Cookies.set("orderDetails", JSON.stringify(state));
    },

    addOrUpdatePaymentType: (state, action: PayloadAction<PaymentType>) => {
      state.paymentType = action.payload;
      Cookies.set("orderDetails", JSON.stringify(state));
    },

    removeAddress: (state) => {
      state.customerAddress = {} as CustomerAddressDto;
    },

    clearOrder: () => {
      Cookies.remove("orderDetails");
      return {} as OrderDetailState;
    },
  },
});

export const {
  addOrUpdateCustomer,
  addOrUpdateAddress,
  addOrUpdatePaymentType,
  removeAddress,
  removeCustomer,
  clearOrder,
} = orderDetailSlice.actions;
export default orderDetailSlice.reducer;
