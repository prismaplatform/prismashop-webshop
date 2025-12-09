"use server";

import { cookies } from "next/headers";
import { getCurrencyByCode } from "@/api/currency";
import { getCurrency } from "@/api/currency";

export async function setCurrencyCookie() {
  try {
    const currencyResponse = await getCurrency();
    const currencyCode = currencyResponse.currency || "RON";

    const currencyObject = getCurrencyByCode(currencyCode) || getCurrencyByCode("RON");

    if (!currencyObject) {
      throw new Error("Invalid currency code.");
    }

    cookies().set("currency", JSON.stringify(currencyObject), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return currencyObject;
  } catch (error) {
    console.error("Error in setCurrencyCookie server action:", error);
    return null;
  }
}
