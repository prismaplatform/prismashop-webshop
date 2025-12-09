import axiosInstance from "@/lib/axiosInstance";
import { BlogDto, BlogWrapperDto } from "@/models/blog.model";

export const getLatestBlogs = async () => {
  try {
    const res = await axiosInstance.get(`shop/blog/latest`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export function objectToQueryString(obj: { [key: string]: any }): string {
  return Object.keys(obj)
    .filter(
      (key) =>
        obj[key] !== undefined &&
        obj[key] !== 0 &&
        obj[key] !== "0" &&
        obj[key] !== "",
    )
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");
}

export const getBlogs = async (page: number) => {
  const query = objectToQueryString({ page: page });
  try {
    const res = await axiosInstance.get(`shop/blogs?${query}`);
    const result: BlogWrapperDto = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const getBlogBySlug = async (slug: string) => {
  const query = objectToQueryString({ slug: slug });
  try {
    const res = await axiosInstance.get(`shop/blog?${query}`);
    const result: BlogDto = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};


