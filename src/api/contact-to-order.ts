import axiosInstance from "@/lib/axiosInstance";
import { ContactToOrderDto } from "@/models/contact-to-order.model";

export const createNewContactToOrder = async (
  contactToOrderDto: ContactToOrderDto,
) => {
  try {
    const res = await axiosInstance.post(
      `shop/contact-to-order`,
      contactToOrderDto,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
