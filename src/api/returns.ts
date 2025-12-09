import { ReturnOrderDto, ReturnOrderResponseDto } from "@/models/return.model";
import axiosInstanceWithToken from "@/lib/axiosInstanceWithToken";

export const createReturn = async (
  payload: ReturnOrderDto,
): Promise<ReturnOrderResponseDto> => {
  try {
    const res = await axiosInstanceWithToken.post<ReturnOrderResponseDto>(
      "/return",
      payload,
    );
    return res.data;
  } catch (error) {
    console.error("Failed to create return", error);
    throw error;
  }
};

export const getAllReturnsByUser = async (userId: number) => {
  try {
    const res = await axiosInstanceWithToken.get(`/return/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch returns for user ${userId}`, error);
    throw error;
  }
};
