"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { X } from "lucide-react";

const Banner = () => {
  const t = useTranslations("Components.Banner");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const closed = Cookies.get("bannerClosed");
    if (t("visible") === "true" && !closed) {
      setIsVisible(true);
    }
  }, [t]);

  const handleClose = () => {
    Cookies.set("bannerClosed", "true", { expires: 2 }); // hide for 2 days
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Link
      href={t.raw("link")}
      className="w-full flex items-center justify-center relative px-4 py-2 text-sm font-medium"
      style={{
        backgroundColor: t("bgColor"),
        color: t("tColor"),
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: t.raw("title") }} />
      <button
        onClick={(e) => {
          e.preventDefault();
          handleClose();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </Link>
  );
};

export default Banner;
