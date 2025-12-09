import axiosInstance from "@/lib/axiosInstance";

export const getLanguages = async () => {
  try {
    const res = await axiosInstance.get(`languages`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching languages:", error);
    throw error;
  }
};
