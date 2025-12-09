"use client";
import { FC, useEffect } from "react";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

export interface ITmProviderProps {
  id: string;
}

const GtmInit: FC<ITmProviderProps> = ({ id }) => {
  useEffect(() => {
    // Initialize fresh dataLayer for each page load
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "gtm_init",
      timestamp: new Date().toISOString(),
    });
  }, []);

  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({
            'gtm.start': new Date().getTime(),
            event:'gtm.js',
            gtm_new: true
          });
          var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${id}');
      `}
    </Script>
  );
};
export default GtmInit;
