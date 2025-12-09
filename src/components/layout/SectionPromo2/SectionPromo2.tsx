import React, { FC } from "react";
import NcImage from "@/components/ui/NcImage/NcImage";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import { getTranslations } from "next-intl/server";

export interface SectionPromo2Props {
  className?: string;
}

const SectionPromo2: FC<SectionPromo2Props> = async ({
  className = "lg:pt-10",
}) => {
  const t = await getTranslations("Pages.Home.ProductsCard");
  return (
    <div className={`nc-SectionPromo2 ${className}`}>
      <div className="relative flex flex-col lg:flex-row lg:justify-end bg-menu-bg-dark dark:bg-neutral-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-12">
        <div className="lg:w-[45%] relative">
          <h2
            className="text-menu-text-light h2 font-semibold text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl mt-6 sm:mt-10 !leading-[1.13] tracking-tight"
            dangerouslySetInnerHTML={{ __html: t.raw("title") }}
          />
          <span
            className="text-menu-text-light block mt-6 dark:text-accent-400"
            dangerouslySetInnerHTML={{ __html: t.raw("text") }}
          />
          <div className="flex space-x-2 sm:space-x-5 mt-6 sm:mt-12">
            <ButtonPrimary href={t("PrimaryButton.link")}>
              {t("PrimaryButton.label")}
            </ButtonPrimary>
          </div>
        </div>

        <NcImage
          alt={t.raw("title")}
          containerClassName="relative block  my-5 lg:my-0 lg:ml-12"
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

export default SectionPromo2;
