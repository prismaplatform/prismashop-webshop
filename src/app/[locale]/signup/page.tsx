import { getTranslations } from "next-intl/server";
import SignUp from "./components/SignUp";
import { Link } from "@/i18n/routing";

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

const PageSignUp = async () => {
  const t = await getTranslations("Pages.Account.Register");

  return (
    <div className="nc-PageSignUp" data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 text-3xl md:text-5xl font-semibold text-center text-menu-text-light dark:text-neutral-100">
          {t("title")}
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <SignUp />
          <span className="block text-center text-menu-text-light dark:text-neutral-300">
            {t("alreadyRegistered")}{" "}
            <Link className="text-primary-500" href="/login">
              {t("signIn")}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
