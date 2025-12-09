import { getTranslations } from "next-intl/server";
import SimplifiedCheckoutFormWithShipping from "@/app/[locale]/checkout/components/SimplifiedCheckoutFormWithShipping";

const generateMetadata = async () => {
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

const CheckoutPage = ({}) => {
  return <SimplifiedCheckoutFormWithShipping />;
};

export default CheckoutPage;
