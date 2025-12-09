import React, { FC } from "react";
import NcImage from "@/components/ui/NcImage/NcImage";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import ButtonSecondary from "@/components/ui/Button/ButtonSecondary";
import { getTranslations } from "next-intl/server";

export interface SectionPromo1Props {
  className?: string;
}

const SectionPromo1: FC<SectionPromo1Props> = async ({ className = "" }) => {
  const t = await getTranslations("Pages.Home.AboutUs");
  return (
    <div
      className={`nc-SectionPromo1 relative flex flex-col lg:flex-row items-center ${className}`}
    >
      <div className="relative flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <h2
          className="text-menu-text-light h2 font-semibold text-3xl sm:text-4xl xl:text-4xl 2xl:text-5xl mt-6 sm:mt-10 !leading-[1.2] tracking-tight"
          dangerouslySetInnerHTML={{
            __html: t.raw("title"),
          }}
        />
        <span
          className="block mt-6 text-menu-text-light dark:text-accent-400 "
          dangerouslySetInnerHTML={{
            __html: t.raw("text"),
          }}
        />
        <div className="flex space-x-2 sm:space-x-5 mt-6 sm:mt-12">
          {/* Correct: The href prop now correctly evaluates the t() function call */}
          <ButtonPrimary href={t("PrimaryButton.link")}>
            {t("PrimaryButton.label")}
          </ButtonPrimary>

          {/* Correct: The href prop now correctly evaluates the t() function call */}
          <ButtonSecondary
            href={t("SecondaryButton.link")}
            className="border border-accent-100 dark:border-accent-700"
          >
            {t("SecondaryButton.label")}
          </ButtonSecondary>
        </div>
      </div>
      <div className="relative flex-1 max-w-xl lg:max-w-none">
        <NcImage
          alt={t.raw("title")}
          containerClassName="block"
          src={t("image")}
          width={700}
          height={400}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-3xl"
        />
      </div>
    </div>
  );
};

export default SectionPromo1;
