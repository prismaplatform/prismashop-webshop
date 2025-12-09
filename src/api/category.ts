import axiosInstance from "@/lib/axiosInstance";

export const getTopCategories = async () => {
  try {
    const res = await axiosInstance.get(`shop/categories/top`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  description: string | null;
  image: string;
  slug: string;
}
