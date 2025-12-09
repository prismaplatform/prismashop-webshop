"use client";

import { useEffect } from "react";
import { setCurrencyCookie } from "@/actions/setCurrencyCookie";

export default function InitCurrencyCookie() {
  useEffect(() => {
    setCurrencyCookie();
  }, []);

  return null;
}
