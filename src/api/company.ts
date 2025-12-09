import axiosInstance from "@/lib/axiosInstance";
import { CourierPrice } from "@/models/courier-price.model";

export const getCourierPrice = async () => {
  try {
    const res = await axiosInstance.get(`shop/courier-default-price`, {});
    const result: CourierPrice = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
