// src/components/ImageModal.tsx

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ProductOptionImageDto } from "@/models/product-option-image.model";

interface ImageModalProps {
  images: ProductOptionImageDto[];
  rootUrl: string;
  startIndex: number;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  images,
  rootUrl,
  startIndex,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-4xl" // Increased max-width for better viewing
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-white bg-black rounded-full bg-opacity-50 hover:bg-opacity-75 focus:outline-none"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <Swiper
          initialSlide={startIndex}
          navigation={true}
          loop={images.length > 1}
          modules={[Navigation]}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <div className="relative flex items-center justify-center w-full h-full">
                <Image
                  src={`${rootUrl}${image.image}`}
                  alt={`Enlarged product image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
