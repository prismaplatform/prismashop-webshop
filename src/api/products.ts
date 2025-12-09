import axiosInstance from "@/lib/axiosInstance";
import { ResultWrapper, ShortProductOptionDto } from "@/models/product.model";
import { ProductFilterDto } from "@/models/filter.model";

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

export const filterProductOptions = async (data: ProductFilterDto) => {
  const query = objectToQueryString(data);

  try {
    const res = await axiosInstance.get(`shop?${query}`);
    const result: ResultWrapper = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const filterFilterOptions = async (data: ProductFilterDto) => {
  const query = objectToQueryString(data);

  try {
    const res = await axiosInstance.get(`shop/filters?${query}`);
    const result: ResultWrapper = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getNewProducts = async () => {
  try {
    const res = await axiosInstance.get(`shop/products/latest`);
    const result: ShortProductOptionDto[] = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getRelatedProducts = async (ids: number[]) => {
  try {
    const query = ids.length ? `?ids=${ids.join(",")}` : "";
    const res = await axiosInstance.get(`shop/products/connected${query}`);
    const result: ShortProductOptionDto[] = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export const getConnectedProducts = async (ids: number[]) => {
  try {
    const query = ids.length ? `?ids=${ids.join(",")}` : "";
    const res = await axiosInstance.get(`shop/products/connected-direct${query}`);
    const result: ShortProductOptionDto[] = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export const getTopProducts = async () => {
  try {
    const res = await axiosInstance.get(`shop/products/top`);
    const result: ShortProductOptionDto[] = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getSearchSuggestions = async (
  searchTerm: string,
): Promise<ShortProductOptionDto[]> => {
  try {
    const res = await axiosInstance.get(
      `shop/suggestions?search_term=${encodeURIComponent(searchTerm)}`,
    );
    // Return the direct array response
    return res.data;
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    // Return an empty array instead of undefined on error
    return [];
  }
};

export const getSimilarProducts = async (data: number) => {
  try {
    const res = await axiosInstance.get(`shop/products/similar/${data}`);
    const result: ShortProductOptionDto[] = res.data;
    return result;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};
