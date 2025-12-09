"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ReactPixel from "react-facebook-pixel";

type PixelTrackerProps = {
  id: string;
};

declare global {
  interface Window {
    dataLayer?: Object[];
    fbq?: (...args: any[]) => void;
  }
}

const PixelTracker = ({ id }: PixelTrackerProps) => {
  const pathname = usePathname();
  const isInitialized = useRef(false);
  const isGTMMode = useRef(!id); // If no ID provided, use GTM mode

  // Direct Pixel Integration (when ID is provided)
  useEffect(() => {
    if (!id || isGTMMode.current || isInitialized.current) return;

    try {
      ReactPixel.init(id, undefined, {
        autoConfig: true,
        debug: false,
      });
      isInitialized.current = true;
      ReactPixel.pageView();
    } catch (error) {}
  }, [id]);

  useEffect(() => {
    if (!pathname) return;
    if (isGTMMode.current) {
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "pageview",
          page: pathname,
        });
      }
      // Also trigger fbq directly if GTM loaded it
      // if (typeof window !== "undefined" && window.fbq) {
      //   window.fbq("track", "PageView");
      // }
    } else if (isInitialized.current) {
      try {
        ReactPixel.pageView();
      } catch (error) {}
    }
  }, [pathname]);
  return null;
};

export default PixelTracker;