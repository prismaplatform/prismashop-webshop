// src/components/CustomSwiper.tsx

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";

import { ImageModal } from "./ImageModal"; // Ensure ImageModal is also updated
import { ProductOptionImageDto } from "@/models/product-option-image.model";
import notfound from "/public/no-image.png";
// Swiper CSS
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface CustomSwiperProps {
  rootUrl: string;
  images?: ProductOptionImageDto[];
}

export const CustomSwiper: React.FC<CustomSwiperProps> = ({
  rootUrl,
  images,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  const openModal = (index: number) => setModalImageIndex(index);
  const closeModal = () => setModalImageIndex(null);

  // --- Placeholder for when no images are available ---
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full rounded-lg aspect-square bg-gray-100 max-h-[500px]">
        <Image
          src={notfound}
          // BUG FIX: Replaced 'name' (undefined) with a descriptive alt text
          alt="No images available"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>
    );
  }

  const totalImages = images.length;
  const getIdealSlidesPerView = (count: number, max: number) =>
    Math.min(count, max);

  return (
    <>
      {/* --- Main Image Swiper --- */}
      <Swiper
        loop={totalImages > 1}
        spaceBetween={10}
        navigation={totalImages > 1}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 aspect-[4/3] w-full rounded-lg mb-1"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id || index}>
            <div
              className="relative flex items-center justify-center w-full h-full cursor-pointer"
              onClick={() => openModal(index)}
            >
              <Image
                src={`${rootUrl}${image.image}`}
                alt={`Product image ${index + 1}`}
                fill // Use 'fill' to expand to the parent div
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="block object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {totalImages > 1 && (
        <div className="flex justify-center mt-3">
          <Swiper
            onSwiper={setThumbsSwiper}
            // 1. Loop is disabled on the thumb slider for better stability
            loop={false}
            spaceBetween={8}
            slidesPerView={getIdealSlidesPerView(totalImages, 4)}
            // 2. freeMode is explicitly enabled for touch scrolling
            freeMode={true}
            watchSlidesProgress={true}
            centerInsufficientSlides={true}
            // 3. Navigation module is removed as it's not needed for free scroll
            modules={[FreeMode, Thumbs]}
            className="mySwiper max-w-full"
            breakpoints={{
              640: { slidesPerView: getIdealSlidesPerView(totalImages, 5) },
              1024: { slidesPerView: getIdealSlidesPerView(totalImages, 7) },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide
                key={image.id || index}
                className="!h-24 !w-24 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent swiper-slide-thumb"
              >
                <Image
                  src={`${rootUrl}${image.image}`}
                  alt={`Thumbnail ${index + 1}`}
                  width={96}
                  height={96}
                  className="block h-full w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* --- Image Modal --- */}
      {modalImageIndex !== null && (
        <ImageModal
          images={images}
          rootUrl={rootUrl}
          startIndex={modalImageIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
};
