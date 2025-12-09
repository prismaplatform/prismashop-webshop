import axiosInstance from "@/lib/axiosInstance";

export const createNewsletter = async (email: string) => {
  try {
    const newsletterDto = {
      email: email,
    };
    const res = await axiosInstance.post(`shop/newsletter`, newsletterDto);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
