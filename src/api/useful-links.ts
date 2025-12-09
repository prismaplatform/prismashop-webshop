import axiosInstance from "@/lib/axiosInstance";

export interface SlugLinkResponse {
  id: number;
  name: string;
  link: string;
  content: string;
  priority: number;
  slug: string;
  seoKeywords: string | null;
  seoDescription: string | null;
}

export const getLinks = async () => {
  try {
    const res = await axiosInstance.get(`shop/links`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching useful links:", error);
    throw error;
  }
};

export const getSlugLink = async (slug: string): Promise<SlugLinkResponse> => {
  try {
    const res = await axiosInstance.get<SlugLinkResponse>(`shop/links/${slug}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching link for slug "${slug}":`, error);
    throw error;
  }
};

export const getPaymentService = async () => {
  try {
    const res = await axiosInstance.get(`shop/payment`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching payment service:", error);
    throw error;
  }
};
