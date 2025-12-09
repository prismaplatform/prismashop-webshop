"use client";

// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import Heading from "@/components/ui/Heading/Heading";
import React, { FC, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

export interface SectionClientSayProps {
  className?: string;
}

interface Review {
  image: string;
  text: string;
  name: string;
  rating: string;
}

// Dynamic import to avoid mismatch in styles
const ReactStars = dynamic(() => import("react-stars"), { ssr: false });

const SectionClientSay: FC<SectionClientSayProps> = ({ className = "" }) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);
  const t = useTranslations("Pages.Home.Reviews");
  const reviews = Object.values(t.raw("Cards")) as Review[];

  useEffect(() => {
    // Check if there are reviews to display before initializing the slider
    if (!reviews || reviews.length === 0) {
      return;
    }

    const OPTIONS: Partial<Glide.Options> = {
      perView: 1,
      keyboard: true, // Enable keyboard navigation
    };

    if (!sliderRef.current) return;

    const slider = new Glide(sliderRef.current, OPTIONS);
    slider.mount();
    setIsShow(true);

    // Cleanup function to destroy the slider instance on component unmount
    return () => {
      slider.destroy();
    };
  }, [sliderRef, reviews]);

  // Do not render the component if there are no reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section
      className={`nc-SectionClientSay relative flow-root ${className}`}
      data-nc-id="SectionClientSay"
      aria-labelledby="testimonials-heading"
    >
      <Heading className="text-menu-text-light" desc={t.raw("text")} isCenter>
        <span
          id="testimonials-heading"
          className="text-menu-text-light"
          dangerouslySetInnerHTML={{ __html: t.raw("title") }}
        />
      </Heading>
      <div className="relative max-w-2xl mx-auto">
        <div
          ref={sliderRef}
          className={`mt-12 lg:mt-16 relative ${isShow ? "" : "invisible"}`}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides" role="presentation">
              {reviews.map((item, index) => (
                <li
                  key={index}
                  className="glide__slide flex flex-col items-center text-center"
                  // role="group" // <-- REMOVE THIS LINE
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${reviews.length}`}
                >
                  <div className="prose prose-sm dark:prose-invert prose-blockquote:text-menu-text-light">
                    <blockquote
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  </div>
                  <span className="block mt-8 text-2xl font-semibold text-menu-text-light">
                    {item.name}
                  </span>
                  <div
                    role="img"
                    aria-label={`Rated ${item.rating} out of 5 stars`}
                  >
                    <ReactStars
                      count={5}
                      value={parseFloat(item.rating)}
                      color1={"#dcdcdc"}
                      edit={false}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Corrected: Reverted to a div container for Glide.js compatibility */}
          <div
            className="mt-10 glide__bullets flex items-center justify-center"
            data-glide-el="controls[nav]"
          >
            {reviews.map((item, index) => (
              <button
                key={index}
                className="glide__bullet w-4 h-4 rounded-full bg-neutral-300 mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                data-glide-dir={`=${index}`}
                aria-label={`Go to testimonial ${index + 1} of ${reviews.length}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionClientSay;
