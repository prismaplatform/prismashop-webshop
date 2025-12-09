import axiosInstance from "@/lib/axiosInstance";
import { NewB2BDto, NewContactDto, NewMuseumDto } from "@/models/contact.model";

export const getContactInfo = async () => {
  try {
    const res = await axiosInstance.get(`shop/contact`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createNewContact = async (contact: NewContactDto) => {
  try {
    const res = await axiosInstance.post(`shop/contact`, contact);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createB2BInquiry = async (b2bData: NewB2BDto) => {
  try {
    const payload = {
      id: 0,
      response: JSON.stringify(b2bData),
    };

    const res = await axiosInstance.post(`shop/form-response`, payload);
    return res.data;
  } catch (error) {
    console.error("Error creating B2B inquiry:", error);
    throw error;
  }
};

export const createMuseumInquiry = async (museumForm: NewMuseumDto) => {
  try {
    const payload = {
      id: 0,
      response: JSON.stringify(museumForm),
    };

    const res = await axiosInstance.post(`shop/form-response`, payload);
    return res.data;
  } catch (error) {
    console.error("Error creating B2B inquiry:", error);
    throw error;
  }
};
