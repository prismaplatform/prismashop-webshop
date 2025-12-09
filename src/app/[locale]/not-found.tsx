import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import React from "react";
import I404Png from "@/images/404.png";
import NcImage from "@/components/ui/NcImage/NcImage";
import { useTranslations } from "next-intl";

const Page404 = () => {
  const t = useTranslations("Pages.NotFound");

  return (
    <div className="nc-Page404">
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-2">
          <NcImage src={I404Png} alt="not-found" />
          <span className="block text-sm text-menu-text-light sm:text-base dark:text-neutral-200 tracking-wider font-medium">
            {t("text")}{" "}
          </span>
          <div className="pt-8">
            <ButtonPrimary href="/">{t("return")}</ButtonPrimary>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Page404;
