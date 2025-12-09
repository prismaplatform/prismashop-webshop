import axiosInstance from "@/lib/axiosInstance";

export const getCurrency = async () => {
  try {
    const res = await axiosInstance.get(`shop/currency`, {});
    return res.data;
  } catch (error) {
    console.error("Error fetching currency:", error);
    throw error;
  }
};

export const CurrencyEnum = {
  USD: { fullName: "United States Dollar", symbol: "$", code: "USD" },
  EUR: { fullName: "Euro", symbol: "€", code: "EUR" },
  GBP: { fullName: "British Pound Sterling", symbol: "£", code: "GBP" },
  JPY: { fullName: "Japanese Yen", symbol: "¥", code: "JPY" },
  CAD: { fullName: "Canadian Dollar", symbol: "C$", code: "CAD" },
  AUD: { fullName: "Australian Dollar", symbol: "A$", code: "AUD" },

  // Other European Currencies
  CHF: { fullName: "Swiss Franc", symbol: "CHF", code: "CHF" },
  SEK: { fullName: "Swedish Krona", symbol: "kr", code: "SEK" },
  DKK: { fullName: "Danish Krone", symbol: "kr", code: "DKK" },
  NOK: { fullName: "Norwegian Krone", symbol: "kr", code: "NOK" },
  PLN: { fullName: "Polish Złoty", symbol: "zł", code: "PLN" },
  CZK: { fullName: "Czech Koruna", symbol: "Kč", code: "CZK" },
  HUF: { fullName: "Hungarian Forint", symbol: "Ft", code: "HUF" },
  RON: { fullName: "Romanian Leu", symbol: "lei", code: "RON" },
  BGN: { fullName: "Bulgarian Lev", symbol: "лв", code: "BGN" },
  TRY: { fullName: "Turkish Lira", symbol: "₺", code: "TRY" },
  RSD: { fullName: "Serbian Dinar", symbol: "дин.", code: "RSD" },
  HRK: { fullName: "Croatian Kuna", symbol: "kn", code: "HRK" }, // Note: Croatia adopted Euro in 2023.
  UAH: { fullName: "Ukrainian Hryvnia", symbol: "₴", code: "UAH" },
  ALL: { fullName: "Albanian Lek", symbol: "L", code: "ALL" },
  BAM: {
    fullName: "Bosnia and Herzegovina Convertible Mark",
    symbol: "KM",
    code: "BAM",
  },
  MKD: { fullName: "Macedonian Denar", symbol: "ден", code: "MKD" },
  MDL: { fullName: "Moldovan Leu", symbol: "L", code: "MDL" },
  ISK: { fullName: "Icelandic Króna", symbol: "kr", code: "ISK" },
  GEL: { fullName: "Georgian Lari", symbol: "₾", code: "GEL" },
  AZN: { fullName: "Azerbaijani Manat", symbol: "₼", code: "AZN" },
  AMD: { fullName: "Armenian Dram", symbol: "֏", code: "AMD" },
  BYN: { fullName: "Belarusian Ruble", symbol: "Br", code: "BYN" },
} as const; // Crucial for type inference and immutability

// Define a type for a single currency entry
export type CurrencyEntry = (typeof CurrencyEnum)[keyof typeof CurrencyEnum];

// Define a union type for all possible currency codes
export type CurrencyCode = keyof typeof CurrencyEnum;

// --- Helper Functions (similar to your Java methods) ---

/**
 * Gets a CurrencyEntry by its code (e.g., "USD").
 */
export function getCurrencyByCode(code: string): CurrencyEntry | undefined {
  return CurrencyEnum[code as CurrencyCode];
}

/**
 * Gets a CurrencyEntry by its symbol.
 */
export function getCurrencyBySymbol(symbol: string): CurrencyEntry | undefined {
  for (const key in CurrencyEnum) {
    const currency = CurrencyEnum[key as CurrencyCode];
    if (currency.symbol.toLowerCase() === symbol.toLowerCase()) {
      return currency;
    }
  }
  return undefined;
}

/**
 * Gets all currency entries as an array.
 */
export function getAllCurrencies(): CurrencyEntry[] {
  return Object.values(CurrencyEnum);
}
