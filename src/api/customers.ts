import axiosInstance from "@/lib/axiosInstance";
import {
  BillingAddressDto,
  CustomerAddressDto,
  LoginDto,
  ShippingAddressDto,
  UpdatePasswordDto,
  UserResponseDto,
} from "@/models/order-detail.model";
import axiosInstanceWithToken from "@/lib/axiosInstanceWithToken";
import Cookies from "js-cookie";
import axios from "axios";

export const createCustomer = async (data: UserResponseDto) => {
  try {
    const res = await axiosInstance.post(`shop/user`, data);
    const result: UserResponseDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateCustomer = async (data: UserResponseDto) => {
  try {
    const res = await axiosInstanceWithToken.patch(`customers`, data);
    const result: UserResponseDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (data: UpdatePasswordDto) => {
  try {
    const res = await axiosInstanceWithToken.patch(`customers/password`, data);
    const result: UserResponseDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const getMainAddressesOfCurrentUser = async () => {
  try {
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      const res = await axiosInstanceWithToken.get(
        `customers/${parsedUser.id}/main-addresses`,
        {},
      );
      const result: CustomerAddressDto[] = res.data;
      return result;
    }
    return [] as CustomerAddressDto[];
  } catch (error) {
    throw error;
  }
};

export const getAllAddressesOfCurrentUser = async () => {
  try {
    const currentUserCookie = Cookies.get("currentUser");
    if (currentUserCookie) {
      const parsedUser: UserResponseDto = JSON.parse(currentUserCookie);
      const res = await axiosInstanceWithToken.get(
        `customers/${parsedUser.id}/addresses`,
        {},
      );
      const result: CustomerAddressDto[] = res.data;
      return result;
    }
    return [] as CustomerAddressDto[];
  } catch (error) {
    throw error;
  }
};

export const getAllTempAddressesOfUser = async () => {
  try {
    const orderDetails = Cookies.get("orderDetails");
    if (orderDetails) {
      const parsedOrderDetails = JSON.parse(orderDetails);
      const res = await axiosInstance.get(
        `shop/${parsedOrderDetails.customer.id}/temp-addresses`,
        {},
      );
      const result: CustomerAddressDto[] = res.data;
      return result;
    }
    return [] as CustomerAddressDto[];
  } catch (error) {
    throw error;
  }
};

export const updateBillingAddress = async (
  id: number,
  data: BillingAddressDto,
) => {
  try {
    const res = await axiosInstance.patch(`shop/${id}/billing-address`, data);
    const result: CustomerAddressDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateShippingAddress = async (
  id: number,
  data: ShippingAddressDto,
) => {
  try {
    const res = await axiosInstance.patch(`shop/${id}/shipping-address`, data);
    const result: CustomerAddressDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteBillingAddress = async (customerId: number, id: number) => {
  try {
    return await axiosInstance.delete(
      `shop/${customerId}/billing-address/${id}`,
    );
  } catch (error) {
    throw error;
  }
};

export const deleteShippingAddress = async (customerId: number, id: number) => {
  try {
    return await axiosInstance.delete(
      `shop/${customerId}/shipping-address/${id}`,
    );
  } catch (error) {
    throw error;
  }
};

export const postNewAddress = async (data: CustomerAddressDto, id: number) => {
  try {
    const res = await axiosInstance.post(`shop/${id}/addresses`, data);
    const result: CustomerAddressDto = res.data;
    return result;
  } catch (error) {
    throw error;
  }
};

export const checkUserExistsByEmail = async (
  email: string,
): Promise<boolean> => {
  try {
    // This endpoint should be implemented in your backend.
    // It should return a 200 OK if the email is found, and a 404 Not Found if it is not.
    await axiosInstance.get(`users/exists-by-email/${email}`);
    return true; // User exists
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false; // User does not exist
    }
    console.error("Error checking email existence:", error);
    // For other errors, we rethrow them to be handled by the caller
    throw new Error("Failed to verify email.");
  }
};

/**
 * Logs in a customer.
 * @param data The login credentials (email and password).
 * @returns The user data upon successful login.
 */
export const loginCustomer = async (
  data: LoginDto,
): Promise<UserResponseDto> => {
  try {
    const res = await axiosInstance.post(`users/login`, data);

    const authToken = res.headers["authorization"];
    if (authToken) {
      Cookies.set("auth", authToken, { expires: 7 }); // expires in 7 days
    }

    const result: UserResponseDto = res.data;
    if (result) {
      Cookies.set("currentUser", JSON.stringify(result), { expires: 7 });
    }
    return result;
  } catch (error) {
    throw error;
  }
};
