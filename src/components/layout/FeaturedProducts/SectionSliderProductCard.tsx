"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Heading from "@/components/ui/Heading/Heading";
// @ts-ignore
import Glide from "@glidejs/glide/dist/glide.esm";
import ProductOptionCard from "../ProductCard/ProductOptionCard";
import { ShortProductOptionDto } from "@/models/product.model";

export interface SectionSliderProductCardProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  headingFontClassName?: string;
  headingClassName?: string;
  subHeading?: string;
  products: ShortProductOptionDto[];
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  products,
}) => {
  const sliderRef = useRef(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const OPTIONS: Partial<Glide.Options> = {
      // direction: document.querySelector("html")?.getAttribute("dir") || "ltr",
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4 - 1,
        },
        1024: {
          gap: 20,
          perView: 4 - 1,
        },
        768: {
          gap: 20,
          perView: 4 - 2,
        },
        640: {
          gap: 10,
          perView: 2,
        },
        500: {
          gap: 10,
          perView: 2,
        },
      },
    };
    if (products && products.length > 0) {
      if (!sliderRef.current) return;

      let slider = new Glide(sliderRef.current, OPTIONS);
      slider.mount();
      setIsShow(true);
      return () => {
        slider.destroy();
      };
    }
  }, [products, sliderRef]);

  return (
    <div className={`nc-SectionSliderProductCard ${className}`}>
      <div ref={sliderRef} className={`flow-root ${isShow ? "" : "invisible"}`}>
        {heading && (
          <Heading className={headingClassName} fontClass={headingFontClassName} hasNextPrev>
            <span
              className="text-menu-text-light"
              dangerouslySetInnerHTML={{
                __html: heading,
              }}
            />
          </Heading>
        )}
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {products &&
              products.map((item, index) => (
                <li key={index} className={`glide__slide ${itemClassName}`}>
                  <ProductOptionCard data={item} index={index} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderProductCard;
