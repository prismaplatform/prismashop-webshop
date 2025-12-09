import React from "react";
import Login from "@/app/[locale]/login/components/Login";
import { getTranslations } from "next-intl/server";

export const generateMetadata = async () => {
  const t = await getTranslations("SEO.pages.Home");
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords").concat(", "),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      siteName: t("title"),
      images: [
        {
          url: t("ogImage"),
          alt: t("ogTitle"),
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [t("ogImage")],
    },
  };
};

const PageLogin = () => {
  return <Login />;
};

export default PageLogin;
