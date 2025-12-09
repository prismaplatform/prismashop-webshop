"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import Heading from "@/components/ui/Heading/Heading";
import CardCategory2 from "@/components/layout/CardCategories/CardCategory2";
import { Link } from "@/i18n/routing";
import { getTopCategories } from "@/api/category";
import { TopCategoryDto } from "@/models/category.model";
import Skeleton from "react-loading-skeleton";
import { useTranslations } from "next-intl";
import "react-loading-skeleton/dist/skeleton.css";
import { useKeenSlider } from "keen-slider/react";

// --- START: NEW `useWindowSize` HOOK ---
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};
// --- END: NEW `useWindowSize` HOOK ---

export interface SectionSliderCategoriesProps {
  className?: string;
}

const SLIDER_THRESHOLD = 4;
const MOBILE_BREAKPOINT = 768; // ADDED: Breakpoint for mobile devices (md)

const SectionSliderCategories: React.FC<SectionSliderCategoriesProps> = ({
  className = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [rootUrl, setRootUrl] = useState("");
  const [topCategories, setTopCategories] = useState<TopCategoryDto[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [useSlider, setUseSlider] = useState(false);

  const t = useTranslations("Pages.Home.SliderCategories");
  const [width] = useWindowSize(); // ADDED: Get window width
  const isMobile = width < MOBILE_BREAKPOINT; // ADDED: Check if the screen is mobile

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    disabled: !useSlider,
    loop: false,
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 500px)": {
        slides: { perView: 2.2, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 24 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 32 },
      },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      let domain = slugifyDomain(window.location.host);
      if (domain.includes("localhost")) {
        domain = slugifyDomain("https://letrafutar.hu");
      }
      const root = `https://${domain}.s3.eu-west-1.amazonaws.com/categories/`;
      setRootUrl(root);
    }
  }, []);

  const slugifyDomain = (url: string) =>
    url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(".prismasolutions.ro", "")
      .replace(".prismaweb.ro", "")
      .replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const result = await getTopCategories();
        setTopCategories(result);

        // UPDATED: Logic now also checks for mobile screen size.
        // Use slider if it's mobile OR if item count is above the threshold.
        if (isMobile || result.length + 1 > SLIDER_THRESHOLD) {
          setUseSlider(true);
        } else {
          setUseSlider(false); // Explicitly set to false for larger screens with few items
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [isMobile]); // ADDED: Re-run this effect if `isMobile` changes.

  useEffect(() => {
    if (slider.current && useSlider) {
      slider.current.update();
    }
  }, [topCategories, useSlider, slider]);

  const renderSkeletons = (count = 4) =>
    Array.from({ length: count }).map((_, index) => (
      <div className="flex-shrink-0" key={`skeleton-${index}`}>
        <div className="flex flex-col space-y-3">
          <div className="aspect-w-1 aspect-h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={16} />
        </div>
      </div>
    ));

  const renderViewAllCard = () => (
    <div className={!useSlider ? "w-full" : "keen-slider__slide"}>
      <div className="relative w-full aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden group bg-hero-bg text-white">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center relative text-primary-500">
            <span
              className="text-lg font-semibold"
              dangerouslySetInnerHTML={{ __html: t("EmptyCard.label1") }}
            />
            <svg
              className="ml-2 w-5 h-5 rotate-45 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 20.4999V3.66992"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className="text-sm mt-1 text-primary-500"
            dangerouslySetInnerHTML={{ __html: t("EmptyCard.label2") }}
          />
        </div>
        <Link
          href={{ pathname: "/products/all" }}
          className="absolute inset-0"
          aria-label={t("EmptyCard.label2")}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {renderSkeletons()}
        </div>
      );
    }

    const categoryCards = topCategories.map((item, index) => (
      <div className={!useSlider ? "w-full" : "keen-slider__slide"} key={index}>
        <CardCategory2
          name={item.name}
          desc={item.description}
          slug={item?.slug}
          featuredImage={item.image ? rootUrl + item.image : null}
        />
      </div>
    ));

    if (useSlider) {
      return (
        <div ref={sliderRef} className="keen-slider">
          {categoryCards}
          {renderViewAllCard()}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-5 gap-4 md:gap-6 lg:gap-8">
        {categoryCards}
        {renderViewAllCard()}
      </div>
    );
  };

  return (
    <div className={`nc-SectionSliderCategories ${className}`}>
      <div className="flow-root">
        <div className="flex justify-between items-center">
          <Heading>
            <span
              className="text-menu-text-light"
              dangerouslySetInnerHTML={{ __html: t.raw("title") }}
            />
          </Heading>
          {useSlider && (
            <div className="flex gap-2">
              <button
                aria-label="Previous slide"
                onClick={() => slider.current?.prev()}
                disabled={currentSlide === 0}
                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                aria-label="Next slide"
                onClick={() => slider.current?.next()}
                disabled={
                  !slider.current ||
                  !slider.current.track.details ||
                  currentSlide >=
                    slider.current.track.details.slides.length -
                      (slider.current.options.slides as any).perView
                }
                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SectionSliderCategories;