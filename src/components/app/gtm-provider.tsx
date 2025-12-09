"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";

export interface ITmProviderProps {
  id: string;
}

const GtmProvider: FC<ITmProviderProps> = ({ id }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pageUrl = window.location.href;
    const pagePath = window.location.pathname + window.location.search;

    window.dataLayer = window.dataLayer || [];

    // Clear previous ecommerce data to prevent unintended carry-over
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
      event: "virtualPageView",
      page_url: pageUrl,
      page_path: pagePath,
      page_title: document.title,
      navigation_type: "route_change",
    });
  }, [pathname, searchParams]);

  return null;
};

export default GtmProvider;
