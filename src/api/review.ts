import axiosInstance from "@/lib/axiosInstance";
import { ReviewDto } from "@/models/review.model";

export const createNewReview = async (review: ReviewDto) => {
  try {
    const res = await axiosInstance.post(`shop/review`, review);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getTopReviews = async () => {
  try {
    const res = await axiosInstance.get(`shop/top-reviews`);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
