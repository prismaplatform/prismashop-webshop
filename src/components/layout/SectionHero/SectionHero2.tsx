"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ButtonPrimary from "@/components/ui/Button/ButtonHero";

// Dynamically import ButtonPrimary to reduce initial bundle size

interface HeroItem {
  image: string;
  title: string;
  subtitle: string;
  Button: {
    label: string;
    link: string;
  };
}

export interface SectionHero2Props {
  className?: string;
}

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  const [indexActive, setIndexActive] = useState(0);
  const [isLoaded, setIsLoaded] = useState(true);
  const t = useTranslations("Pages.Home");
  const heroItems = Object.values(t.raw("Hero")) as HeroItem[];

  const handleNext = useCallback(() => {
    setIndexActive((prev) => (prev >= heroItems.length - 1 ? 0 : prev + 1));
  }, [heroItems.length]);

  const handlePrev = () => {
    setIndexActive((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [indexActive, handleNext]);

  const renderDots = () => {
    if (!isLoaded) return null;

    return (
      <div className="absolute bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-20 flex justify-center">
        {heroItems.map((_, index) => (
          <div
            key={index}
            onClick={() => setIndexActive(index)}
            className="relative px-1 py-1.5 cursor-pointer"
          >
            <div className="relative w-20 h-2 shadow-sm rounded-md bg-white">
              {indexActive === index && (
                <div className="nc-SectionHero2Item__dot absolute inset-0 bg-primary-500 rounded-md"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div
        className={`relative h-[600px] md:h-[700px] lg:h-[800px] bg-accent-100 ${className}`}
        aria-busy="true"
      >
        <div className="absolute inset-0 bg-hero-bg animate-pulse"></div>
      </div>
    );
  }

  const activeItem = heroItems[indexActive];

  return (
    <div className="relative" role="main">
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
      >
        <div className=" relative flex flex-col-reverse overflow-hidden py-8 lg:flex-col bg-accent-100">
          <div>{renderDots()}</div>

          <div className="absolute inset-0 bg-hero-bg"></div>

          <div className="hidden lg:block">
            {/*absolute*/}
            <div className="end-0 rtl:-end-28 bottom-0 top-0 w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
              <Image
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-contain object-right-bottom nc-SectionHero2Item__image"
                src={activeItem.image}
                alt={activeItem.title
                  .replace(/<[^>]*>?/gm, "")
                  .substring(0, 14)}
              />
            </div>
          </div>

          <div className="flex py-12 sm:py-14 lg:items-center">
            <div className="container relative">
              <div className="relative z-[1] w-full max-w-3xl space-y-8 sm:space-y-14 nc-SectionHero2Item__left">
                <div className="space-y-5 sm:space-y-6">
                  <span
                    className="nc-SectionHero2Item__subheading block text-base md:text-xl text-hero-text font-medium"
                    dangerouslySetInnerHTML={{ __html: activeItem.subtitle }}
                  />

                  <h1
                    className="nc-SectionHero2Item__heading font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[114%] text-hero-text"
                    dangerouslySetInnerHTML={{ __html: activeItem.title }}
                  ></h1>
                </div>

                <ButtonPrimary
                  className="nc-SectionHero2Item__button dark:bg-accent-900"
                  sizeClass="py-3 px-6 sm:py-5 sm:px-9"
                  href={activeItem.Button.link}
                >
                  <span>{activeItem.Button.label}</span>
                  <span>
                    <svg
                      className="w-5 h-5 ms-2.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 22L20 20"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={"next-to" + activeItem.title}
        className="absolute inset-y-px end-0 px-10 hidden lg:flex items-center justify-center z-10 text-accent-700"
        onClick={handleNext}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={0.6}
          stroke="currentColor"
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label={"prev-to" + activeItem.title}
        className="absolute inset-y-px start-0 px-10 hidden lg:flex items-center justify-center z-10 text-accent-700"
        onClick={handlePrev}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={0.6}
          stroke="currentColor"
          className="h-12 w-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default SectionHero2;
