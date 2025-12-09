"use client";

import { createContext, ReactNode, useContext } from "react";

type DomainContextType = string | null;

const DomainContext = createContext<DomainContextType>(null);

export function DomainProvider({
  children,
  domain,
}: {
  children: ReactNode;
  domain: string;
}) {
  return (
    <DomainContext.Provider value={domain}>{children}</DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (context === null) {
    throw new Error("useDomain must be used within a DomainProvider");
  }
  return context;
}
