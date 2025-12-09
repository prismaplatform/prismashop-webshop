import axiosInstance from "@/lib/axiosInstance";

export const getMenu = async () => {
  try {
    const res = await axiosInstance.get(`shop/menu`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
