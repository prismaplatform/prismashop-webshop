import axiosInstance from "@/lib/axiosInstance";

export const getSitemap = async () => {
  try {
    const res = await axiosInstance.get(`shop/sitemap`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};

export const getProductSitemap = async () => {
  try {
    const res = await axiosInstance.get(`shop/product-sitemap`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching links:", error);
    throw error;
  }
};
