import React, { FC } from "react";
import ButtonPrimary from "@/components/ui/Button/ButtonPrimary";
import Image, { StaticImageData } from "next/image";

export interface SectionHeroProps {
  className?: string;
  rightImg: string | StaticImageData;
  heading: string;
  subHeading: string;
  btnText: string;
  btnHref?: string; // Optional: Link for the button
  alt: string; // Required: Alt text for the image
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  rightImg,
  heading,
  subHeading,
  btnText,
  btnHref,
  alt,
}) => {
  return (
    <div
      className={`nc-SectionHero relative ${className}`}
      data-nc-id="SectionHero"
    >
      <div className="grid grid-cols-2 space-y-14 lg:space-y-0 lg:space-x-10 items-center relative text-center lg:text-left">
        <div className="w-screen max-w-full space-y-5 lg:space-y-7 col-span-2 md:col-span-1  ">
          <div
            className="text-3xl h2 !leading-tight font-semibold text-menu-text-light md:text-4xl xl:text-5xl dark:text-neutral-100"
            dangerouslySetInnerHTML={{ __html: heading }}
          ></div>
          <div
            className="block text-base xl:text-lg text-menu-text-light dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: subHeading }}
          ></div>
          {!!btnText && (
            <ButtonPrimary href={btnHref || "/"}>{btnText}</ButtonPrimary>
          )}
        </div>
        <div className="flex-grow col-span-2 md:col-span-1 ">
          <Image
            className="w-full rounded-xl"
            width={700}
            height={400}
            src={rightImg}
            alt={alt}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default SectionHero;
