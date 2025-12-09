import React from "react";
import Input from "@/components/ui/Input/Input";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { Link } from "@/i18n/routing";
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

const PageForgotPass = async ({}) => {
  const t = await getTranslations("Pages.Account.ForgotPassword");

  return (
    <div className="container mb-24 lg:mb-32">
      <header className="text-center max-w-2xl mx-auto - mb-14 sm:mb-16 lg:mb-20">
        <h2 className="mt-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-menu-text-light dark:text-neutral-100 justify-center">
          {t("title")}
        </h2>
        <span className="block text-sm mt-4 text-menu-text-light sm:text-base dark:text-neutral-200">
          {t("text")}
        </span>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" action="#" method="post">
          <label className="block">
            <span className="text-menu-text-light dark:text-neutral-200">
              {t("email")}
            </span>
            <Input
              type="email"
              placeholder="example@example.com"
              className="mt-1"
            />
          </label>
          <ButtonPrimary type="submit">{t("continue")}</ButtonPrimary>
        </form>

        {/* ==== */}
        <span className="block text-center text-menu-text-light dark:text-neutral-300">
          {t("goBack")} {` `}
          <Link href="/login" className="text-primary-500">
            {t("signIn")}
          </Link>
          {` / `}
          <Link href="/signup" className="text-primary-500">
            {t("signUp")}
          </Link>
        </span>
      </div>
    </div>
  );
};

export default PageForgotPass;
