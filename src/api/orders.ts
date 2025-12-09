import { NewOrderDto, OrderDto } from "@/models/order-detail.model";
import axiosInstance from "@/lib/axiosInstance";
import axiosInstanceWithToken from "@/lib/axiosInstanceWithToken";

export const createNewOrder = async (data: NewOrderDto) => {
  try {
    const res = await axiosInstance.post(`orders`, data);
    const result: OrderDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const requestPaymentUrl = async (id: number) => {
  try {
    const res = await axiosInstance.post(`payment/request-checkout`, null, {
      params: { orderId: id },
    });
    const result: string = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

// export const getAllOrders = async (id: number) => {
//   try {
//     const res = await axiosInstanceWithToken.get(`orders/${id}`, {});
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     throw error;
//   }
// };

export const getAllOrders = async (id: number) => {
  try {
    const res = await axiosInstanceWithToken.get(`orders/${id}`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
