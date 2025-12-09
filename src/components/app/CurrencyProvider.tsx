"use client";

import React, { createContext, useContext, useState } from "react";
import type { CurrencyEntry } from "@/api/currency";

const CurrencyContext = createContext<CurrencyEntry | undefined>(undefined);

export const CurrencyProvider = ({
  value,
  children,
}: {
  value: CurrencyEntry;
  children: React.ReactNode;
}) => {
  const [currency] = useState(value); // preserve reactivity if needed
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
